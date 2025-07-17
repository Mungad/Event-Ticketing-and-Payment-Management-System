import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../index';
import db from '../../drizzle/db';
import { UsersTable, VenuesTable } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

let token: string;
let adminId: number;
let venueId: number;

const adminUser = {
  firstname: 'VenueAdmin',
  lastname: 'Test',
  email: 'venueadmin@example.com',
  password: 'adminpass123',
};

beforeAll(async () => {
  const hashedPassword = bcrypt.hashSync(adminUser.password, 10);
  const [admin] = await db.insert(UsersTable).values({
    ...adminUser,
    password: hashedPassword,
    role: 'admin',
    is_verified: true
  }).returning();

  adminId = admin.user_id;

  const res = await request(app)
    .post('/users/login')
    .send({ email: adminUser.email, password: adminUser.password });

  token = res.body.token;
});

afterAll(async () => {
  await db.delete(VenuesTable).where(eq(VenuesTable.venue_id, venueId));
  await db.delete(UsersTable).where(eq(UsersTable.email, adminUser.email));
});

describe('Venue Controller Integration Tests', () => {
  it('should create a new venue', async () => {
    const res = await request(app)
      .post('/venues')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Venue',
        address: '123 Test Lane',
        capacity: 200
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/Venue created successfully/i);
    expect(res.body.venue.name).toBe('Test Venue');
    venueId = res.body.venue.venue_id;
  });

  it('should fetch all venues', async () => {
    const res = await request(app)
      .get('/venues');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch a venue by ID', async () => {
    const res = await request(app)
      .get(`/venues/${venueId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.venue_id).toBe(venueId);
  });

  it('should return 404 for non-existent venue', async () => {
    const res = await request(app).get('/venues/999999');
    expect(res.statusCode).toBe(404);
  });

  it('should update a venue (admin only)', async () => {
    const res = await request(app)
      .put(`/venues/${venueId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Venue Name'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/updated successfully/i);
    expect(res.body.venue.name).toBe('Updated Venue Name');
  });

  it('should return 404 when updating a non-existent venue', async () => {
    const res = await request(app)
      .put('/venues/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ghost Venue' });

    expect(res.statusCode).toBe(404);
  });

  it('should delete a venue (admin only)', async () => {
    const res = await request(app)
      .delete(`/venues/${venueId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it('should return 404 when deleting non-existent venue', async () => {
    const res = await request(app)
      .delete(`/venues/${venueId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  it('should reject unauthenticated create attempt', async () => {
    const res = await request(app)
      .post('/venues')
      .send({
        name: 'Unauthorized Venue',
        address: 'No Access',
        capacity: 100
      });

    expect(res.statusCode).toBe(401);
  });
});

it('should reject unauthorized update attempt', async () => {
  const res = await request(app)
    .put(`/venues/${venueId}`)
    .send({ name: 'Unauthorized Update' });

  expect(res.statusCode).toBe(401);
});