import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../index';
import db from '../../drizzle/db';
import { UsersTable } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

jest.mock('../../mailer/email.service', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
}));

let token: string;
let testUserId: number;

const testUser = {
  firstname: 'Daisy',
  lastname: 'Tester',
  email: `daisytest${Date.now()}@example.com`,
  password: 'testpass123',
};

beforeAll(async () => {
  const hashedPassword = bcrypt.hashSync(testUser.password, 10);
  const [user] = await db.insert(UsersTable).values({
    ...testUser,
    password: hashedPassword,
    role: 'admin',
    is_verified: true,
  }).returning();

  testUserId = user.user_id;

  const res = await request(app)
    .post('/users/login')
    .send({ email: testUser.email, password: testUser.password });

  token = res.body.token;
});

afterAll(async () => {
  await db.delete(UsersTable).where(eq(UsersTable.email, testUser.email));
});

describe('User Controller Integration Tests', () => {
  const email = `verifyuser${Date.now()}@example.com`;

  it('should register a new user', async () => {
    const res = await request(app).post('/users').send({
      firstname: 'Verify',
      lastname: 'User',
      email,
      password: 'verify123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(email);
  });

  // it('should fail to register duplicate email', async () => {
  //   const res = await request(app).post('/users').send({
  //     firstname: 'Verify',
  //     lastname: 'User',
  //     email,
  //     password: 'verify123',
  //   });

  //   expect(res.statusCode).toBe(400);
  //   expect(res.body.error).toMatch(/email already registered/i);
  // });

  it('should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ email: testUser.email, password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/invalid email or password/i);
  });

  it('should fail login if email not verified', async () => {
    const unverifiedEmail = `unverified${Date.now()}@example.com`;
    await db.insert(UsersTable).values({
      firstname: 'Unverified',
      lastname: 'User',
      email: unverifiedEmail,
      password: bcrypt.hashSync('notverified123', 10),
      role: 'user',
      is_verified: false,
    });

    const res = await request(app)
      .post('/users/login')
      .send({ email: unverifiedEmail, password: 'notverified123' });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/verify your email/i);

    await db.delete(UsersTable).where(eq(UsersTable.email, unverifiedEmail));
  });

  it('should login successfully', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should verify email with correct code', async () => {
    const verifyEmail = `verifycode${Date.now()}@example.com`;
    const code = '123456';

    await db.insert(UsersTable).values({
      firstname: 'Verify',
      lastname: 'Code',
      email: verifyEmail,
      password: bcrypt.hashSync('verify123', 10),
      role: 'user',
      is_verified: false,
      verification_code: code,
    });

    const res = await request(app)
      .post('/users/verify')
      .send({ email: verifyEmail, verificationCode: code });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/verified successfully/i);

    await db.delete(UsersTable).where(eq(UsersTable.email, verifyEmail));
  });

  it('should get all users (admin only)', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get user by ID (admin or self)', async () => {
    const res = await request(app)
      .get(`/users/${testUserId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(testUser.email);
  });

  it('should update user info', async () => {
    const res = await request(app)
      .put(`/users/${testUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ firstname: 'Updated' });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.firstname).toBe('Updated');
  });

  it('should deny update if not owner or admin', async () => {
    const outsiderEmail = `outsider${Date.now()}@example.com`;
    const [outsider] = await db.insert(UsersTable).values({
      firstname: 'Outsider',
      lastname: 'User',
      email: outsiderEmail,
      password: bcrypt.hashSync('outsider123', 10),
      role: 'user',
      is_verified: true,
    }).returning();

    const res = await request(app)
      .put(`/users/${outsider.user_id}`)
      .send({ firstname: 'Hacky' });

    expect(res.statusCode).toBe(401); // No token

    await db.delete(UsersTable).where(eq(UsersTable.email, outsiderEmail));
  });

  it('should reject access without token', async () => {
    const res = await request(app).get(`/users/${testUserId}`);
    expect(res.statusCode).toBe(401);
  });

  it('should delete a user (admin only)', async () => {
    const delEmail = `delete${Date.now()}@example.com`;
    const [toDelete] = await db.insert(UsersTable).values({
      firstname: 'ToDelete',
      lastname: 'User',
      email: delEmail,
      password: bcrypt.hashSync('pass', 10),
      is_verified: true,
      role: 'user',
    }).returning();

    const res = await request(app)
      .delete(`/users/${toDelete.user_id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it('should return 404 if deleting non-existent user', async () => {
    const res = await request(app)
      .delete(`/users/999999`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
