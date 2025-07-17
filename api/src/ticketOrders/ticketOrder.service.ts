import db from '../drizzle/db';
import { TicketOrdersTable } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { TITicketOrder, TSTicketOrder } from '../drizzle/schema';

// Get all orders
export const getAll = async (): Promise<TSTicketOrder[]> => {
  return await db.select().from(TicketOrdersTable);
};

// Get order by ID
export const getById = async (id: number): Promise<TSTicketOrder | undefined> => {
  const result = await db.select().from(TicketOrdersTable).where(eq(TicketOrdersTable.order_id, id));
  return result[0];
};

// Create order
export const create = async (data: TITicketOrder): Promise<TSTicketOrder | undefined> => {
  const result = await db.insert(TicketOrdersTable).values(data).returning();
  return result[0];
};

// Update order
export const update = async (id: number, data: Partial<TITicketOrder>): Promise<TSTicketOrder | undefined> => {
  const result = await db.update(TicketOrdersTable)
    .set(data)
    .where(eq(TicketOrdersTable.order_id, id))
    .returning();
  return result[0];
};

// Delete order
export const remove = async (id: number): Promise<boolean> => {
  const result = await db.delete(TicketOrdersTable)
    .where(eq(TicketOrdersTable.order_id, id))
    .returning();
  return result.length > 0;
};
