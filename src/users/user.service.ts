import db from '../drizzle/db';
import { UsersTable } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { TIUser, TSUser } from '../drizzle/schema';

// Get all users
export const getAll = async (): Promise<TSUser[]> => {
  try {
    return await db.select().from(UsersTable);
  } catch {
    throw new Error('Failed to get users');
  }
};

// Get user by ID
export const getById = async (id: number): Promise<TSUser | undefined> => {
  const result = await db.select().from(UsersTable).where(eq(UsersTable.user_id, id));
  return result[0];
};

// Create user
export const create = async (data: TIUser): Promise<TSUser | undefined> => {
  const result = await db.insert(UsersTable).values(data).returning();
  return result[0];
};

// Update user
export const update = async (id: number, data: Partial<TIUser>): Promise<TSUser | undefined> => {
  const result = await db.update(UsersTable).set(data).where(eq(UsersTable.user_id, id)).returning();
  return result[0];
};

// Delete user
export const remove = async (id: number): Promise<boolean> => {
  const result = await db.delete(UsersTable).where(eq(UsersTable.user_id, id)).returning();
  return result.length > 0;
};
