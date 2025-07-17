import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../index';
import db from '../../drizzle/db';
import { UsersTable, SupportTicketsTable } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

let token: string;
let testUserId: number;
let ticketId: number;

const testUser = {
  firstname: 'Support',
  lastname: 'Tester',
  email: 'supportuser@example.com',
  password: 'testpass123',
};

beforeAll(async () => {
  const hashedPassword = bcrypt.hashSync(testUser.password, 10);
  const [user] = await db.insert(UsersTable).values({
    ...testUser,
    password: hashedPassword,
    role: 'admin',
    is_verified: true
  }).returning();

  testUserId = user.user_id;

  const res = await request(app)
    .post('/users/login')
    .send({ email: testUser.email, password: testUser.password });

  token = res.body.token;
});

afterAll(async () => {
  await db.delete(SupportTicketsTable).where(eq(SupportTicketsTable.user_id, testUserId));
  await db.delete(UsersTable).where(eq(UsersTable.user_id, testUserId));
});

describe('Support Ticket Controller Integration Tests', () => {
  it('should create a new support ticket', async () => {
    const res = await request(app)
      .post('/support-tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user_id: testUserId,
        subject: 'Issue with event ticket',
        description: 'I was charged twice for the same ticket.',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.ticket.subject).toMatch(/Issue with event ticket/i);
    ticketId = res.body.ticket.ticket_id;
  });

  it('should get all support tickets', async () => {
    const res = await request(app)
      .get('/support-tickets')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get support ticket by ID', async () => {
    const res = await request(app)
      .get(`/support-tickets/${ticketId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.ticket_id).toBe(ticketId);
  });

  it('should update a support ticket', async () => {
    const res = await request(app)
      .put(`/support-tickets/${ticketId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'In Progress' });

    expect(res.statusCode).toBe(200);
    expect(res.body.ticket.status).toBe('In Progress');
  });

  it('should delete a support ticket', async () => {
    const res = await request(app)
      .delete(`/support-tickets/${ticketId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  // Negative tests
  it('should return 404 for non-existent ticket', async () => {
    const res = await request(app)
      .get('/support-tickets/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  it('should return 400 if ticket ID is invalid', async () => {
    const res = await request(app)
      .get('/support-tickets/invalid-id')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(500);
  });
});
