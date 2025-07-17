import db from '../drizzle/db';
import { UsersTable } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { TIUser, TSUser } from '../drizzle/schema';

// Get all users
export const getAll = async (): Promise<TSUser[]> => {
    return await db.select().from(UsersTable);
};

// Get user by ID
export const getById = async (id: number): Promise<TSUser | undefined> => {
    const result = await db.select().from(UsersTable).where(eq(UsersTable.user_id, id));
    return result[0];
};

// Get user by email (for login or verification)
export const getByEmail = async (email: string): Promise<TSUser | undefined> => {
    const result = await db.select().from(UsersTable).where(eq(UsersTable.email, email));
    return result[0];
};

// Create new user or admin
export const create = async (data: TIUser): Promise<TSUser | undefined> => {
    try {
        const result = await db.insert(UsersTable).values(data).returning();
        return result[0];
    } catch (error: any) {
        if (error.code === '23505') {
            throw new Error('Email already exists');
        }
        throw error;
    }
};

// Update user
export const update = async (id: number, data: Partial<TIUser>): Promise<TSUser | undefined> => {
    try {
        const result = await db.update(UsersTable)
            .set(data)
            .where(eq(UsersTable.user_id, id))
            .returning();
        return result[0];
    } catch (error: any) {
        if (error.code === '23505') {
            throw new Error('Email already exists');
        }
        throw error;
    }
};

// Delete user
export const remove = async (id: number): Promise<boolean> => {
    const result = await db.delete(UsersTable)
        .where(eq(UsersTable.user_id, id))
        .returning();
    return result.length > 0;
};

// Check if email exists (optional utility)
export const emailExists = async (email: string): Promise<boolean> => {
    const result = await db.select({ userID: UsersTable.user_id })
        .from(UsersTable)
        .where(eq(UsersTable.email, email));
    return result.length > 0;
};
