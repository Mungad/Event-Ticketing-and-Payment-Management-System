import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../index';
import db from '../../drizzle/db';
import { PaymentsTable, UsersTable } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

let token: string;
let testUserId: number;
let testEmail: string;
let testPaymentId: number;

beforeAll(async () => {
  // Create admin user
  const [user] = await db.insert(UsersTable).values({
    firstname: 'Pay',
    lastname: 'Admin',
    email: 'paymentadmin@example.com',
    password: bcrypt.hashSync('adminpass', 10),
    role: 'admin',
    is_verified: true,
  }).returning();
  testUserId = user.user_id;
  testEmail = user.email;

  // Login to get token
  const res = await request(app)
    .post('/users/login')
    .send({ email: 'paymentadmin@example.com', password: 'adminpass' });
  token = res.body.token;
});

afterAll(async () => {
  if (testPaymentId) {
    await db.delete(PaymentsTable).where(eq(PaymentsTable.payment_id, testPaymentId));
  }
  await db.delete(UsersTable).where(eq(UsersTable.email, testEmail));
});

describe('Payment Controller Integration Tests', () => {
  it('should create a new payment', async () => {
    const res = await request(app)
      .post('/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user_id: testUserId,
        amount: 250.00,
        method: 'credit_card',
        status: 'completed'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.payment).toHaveProperty('payment_id');
    expect(res.body.payment.amount).toBe('250.00');
    testPaymentId = res.body.payment.payment_id;
  });

  it('should get all payments', async () => {
    const res = await request(app)
      .get('/payments')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get payment by ID', async () => {
    const res = await request(app)
      .get(`/payments/${testPaymentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.payment_id).toBe(testPaymentId);
  });

  it('should return 404 for non-existent payment ID', async () => {
    const res = await request(app)
      .get('/payments/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  it('should update a payment', async () => {
    const res = await request(app)
      .put(`/payments/${testPaymentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 300.00,
        status: 'refunded'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.payment.amount).toBe('300.00');
  });

  it('should return 404 when updating non-existent payment', async () => {
    const res = await request(app)
      .put('/payments/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'failed' });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  it('should delete a payment', async () => {
    const res = await request(app)
      .delete(`/payments/${testPaymentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it('should return 404 when deleting non-existent payment', async () => {
    const res = await request(app)
      .delete('/payments/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});
