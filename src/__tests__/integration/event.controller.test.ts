import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../index';
import db from '../../drizzle/db';
import { EventsTable, UsersTable, VenuesTable } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

// Auth setup
let token: string;
let testUserId: number;
let testEmail: string;
let testVenueId: number;
let testEventId: number;

beforeAll(async () => {
  // Create venue 
  const [venue] = await db.insert(VenuesTable).values({
    name: 'Test Venue',
    address: 'Test Address',
    capacity: 500,
  }).returning();
  testVenueId = venue.venue_id;

  // Create admin user
  const [user] = await db.insert(UsersTable).values({
    firstname: 'Event',
    lastname: 'Admin',
    email: 'eventadmin@example.com',
    password: bcrypt.hashSync('adminpass', 10),
    role: 'admin',
    is_verified: true
  }).returning();
  testUserId = user.user_id;
   testEmail = user.email;
  console.log("user id", testUserId);
  console.log("user id", testEmail);


  // Login to get token
  const res = await request(app)
    .post('/users/login')
    .send({ email: 'eventadmin@example.com', password: 'adminpass' });
  token = res.body.token;
});

afterAll(async () => {
  await db.delete(EventsTable).where(eq(EventsTable.event_id, testEventId));
  await db.delete(VenuesTable).where(eq(VenuesTable.venue_id, testVenueId));
  await db.delete(UsersTable).where(eq(UsersTable.email, testEmail));
});

describe('Event Controller Integration Tests', () => {
  it('should create a new event', async () => {
    const res = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Event',
        description: 'This is a test event',
        venue_id: testVenueId,
        category: 'Music',
        date: new Date().toISOString(),
        time: '18:00',
        ticket_price: '100.00',
        tickets_total: 200,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.event.title).toBe('Test Event');
    testEventId = res.body.event.event_id;
    console.log("Event ID created:", testEventId);
  });

  it('should get all events', async () => {
    const res = await request(app).get('/events');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get event by ID', async () => {
    const res = await request(app).get(`/events/${testEventId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.event_id).toBe(testEventId);
  });

  it('should return 404 if event ID not found', async () => {
    const res = await request(app).get('/events/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  it('should update an event', async () => {
    const res = await request(app)
      .put(`/events/${testEventId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Event Title' });

    expect(res.statusCode).toBe(200);
    expect(res.body.event.title).toBe('Updated Event Title');
  });

  it('should return 404 when updating non-existent event', async () => {
    const res = await request(app)
      .put('/events/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Ghost Event' });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  it('should delete an event', async () => {
    const res = await request(app)
      .delete(`/events/${testEventId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it('should return 404 when deleting non-existent event', async () => {
    const res = await request(app)
      .delete('/events/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});
