import db from '../drizzle/db';
import { SupportTicketsTable } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { TISupportTicket, TSSupportTicket } from '../drizzle/schema';

// Get all support tickets
export const getAll = async (): Promise<TSSupportTicket[]> => {
  return await db.select().from(SupportTicketsTable);
};

// Get support ticket by ID
export const getById = async (id: number): Promise<TSSupportTicket | undefined> => {
  const result = await db.select().from(SupportTicketsTable).where(eq(SupportTicketsTable.ticket_id, id));
  return result[0];
};

// Create support ticket
export const create = async (data: TISupportTicket): Promise<TSSupportTicket | undefined> => {
  const result = await db.insert(SupportTicketsTable).values(data).returning();
  return result[0];
};

// Update support ticket
export const update = async (id: number, data: Partial<TISupportTicket>): Promise<TSSupportTicket | undefined> => {
  const result = await db.update(SupportTicketsTable)
    .set(data)
    .where(eq(SupportTicketsTable.ticket_id, id))
    .returning();
  return result[0];
};

// Delete support ticket
export const remove = async (id: number): Promise<boolean> => {
  const result = await db.delete(SupportTicketsTable)
    .where(eq(SupportTicketsTable.ticket_id, id))
    .returning();
  return result.length > 0;
};
