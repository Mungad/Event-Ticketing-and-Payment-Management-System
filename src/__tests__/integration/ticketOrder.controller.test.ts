import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../index';
import db from '../../drizzle/db';
import { UsersTable, VenuesTable, EventsTable, TicketOrdersTable } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

let token: string;
let testUserId: number;
let testVenueId: number;
let testEventId: number;
let testOrderId: number;

beforeAll(async () => {
  // Create admin user
  const hashedPassword = bcrypt.hashSync('adminpass', 10);
  const [admin] = await db.insert(UsersTable).values({
    firstname: 'Admin',
    lastname: 'Tester',
    email: 'admin_ticket@example.com',
    password: hashedPassword,
    role: 'admin',
    is_verified: true
  }).returning();
  testUserId = admin.user_id;

  // Get token
  const res = await request(app)
    .post('/users/login')
    .send({ email: 'admin_ticket@example.com', password: 'adminpass' });

  token = res.body.token;

  // Create Venue
  const [venue] = await db.insert(VenuesTable).values({
    name: 'Test Venue',
    address: 'Nairobi',
    capacity: 500,
    created_at: new Date()
  }).returning();
  testVenueId = venue.venue_id;

  // Create Event
  const [event] = await db.insert(EventsTable).values({
    title: 'Test Event',
    description: 'Description',
    venue_id: testVenueId,
    category: 'Music',
    date: new Date(),
    time: '18:00',
    ticket_price: '100.00',
    tickets_total: 100,
    tickets_sold: 0,
    created_at: new Date(),
    updated_at: new Date()
  }).returning();
  testEventId = event.event_id;
});

afterAll(async () => {
  await db.delete(TicketOrdersTable).where(eq(TicketOrdersTable.order_id, testOrderId));
  await db.delete(EventsTable).where(eq(EventsTable.event_id, testEventId));
  await db.delete(VenuesTable).where(eq(VenuesTable.venue_id, testVenueId));
  await db.delete(UsersTable).where(eq(UsersTable.user_id, testUserId));
});

describe('Ticket Order Controller Integration Tests', () => {
  it('should create a ticket order', async () => {
    const res = await request(app)
      .post('/ticket-orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user_id: testUserId,
        event_id: testEventId,
        quantity: 2,
        total_price: '200.00'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/created successfully/i);
    testOrderId = res.body.order.order_id;
  });

  it('should get all ticket orders', async () => {
    const res = await request(app)
      .get('/ticket-orders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a ticket order by ID', async () => {
    const res = await request(app)
      .get(`/ticket-orders/${testOrderId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.order_id).toBe(testOrderId);
  });

  it('should return 404 if ticket order not found', async () => {
    const res = await request(app)
      .get('/ticket-orders/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  it('should update a ticket order', async () => {
    const res = await request(app)
      .put(`/ticket-orders/${testOrderId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 3, total_price: '300.00' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/updated successfully/i);
  });

  it('should return 404 when updating non-existent ticket order', async () => {
    const res = await request(app)
      .put('/ticket-orders/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(404);
  });

  it('should delete a ticket order', async () => {
    const res = await request(app)
      .delete(`/ticket-orders/${testOrderId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it('should return 404 when deleting non-existent order', async () => {
    const res = await request(app)
      .delete('/ticket-orders/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
