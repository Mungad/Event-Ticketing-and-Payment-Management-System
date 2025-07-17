import * as userService from '../../users/user.service';
import db from '../../../src/drizzle/db';
import { TIUser, TSUser } from '../../../src/drizzle/schema';

jest.mock('../../../src/drizzle/db', () => ({
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

describe('user.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Get all users
  it('should return all users', async () => {
    const mockUsers: TSUser[] = [
      {
        user_id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'hashedpass',
        contact_phone: '0712345678',
        address: 'Nairobi',
        role: 'user',
        verification_code: '123456',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockResolvedValueOnce(mockUsers)
    });

    const result = await userService.getAll();
    expect(result).toEqual(mockUsers);
  });

  // Get user by ID
  it('should return a user by ID', async () => {
    const mockUser: TSUser = {
      user_id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'hashedpass',
      contact_phone: '0712345678',
      address: 'Nairobi',
      role: 'user',
      verification_code: '123456',
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    };

    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn(() => ({
        where: jest.fn().mockResolvedValueOnce([mockUser])
      }))
    });

    const result = await userService.getById(1);
    expect(result).toEqual(mockUser);
  });

  // Get user by email
  it('should return a user by email', async () => {
    const mockUser: TSUser = {
      user_id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'hashedpass',
      contact_phone: '0712345678',
      address: 'Nairobi',
      role: 'user',
      verification_code: '123456',
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    };

    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn(() => ({
        where: jest.fn().mockResolvedValueOnce([mockUser])
      }))
    });

    const result = await userService.getByEmail('john@example.com');
    expect(result).toEqual(mockUser);
  });

  // Create user
  it('should create a new user', async () => {
    const user: TIUser = {
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'alice@example.com',
      password: 'pass123',
      contact_phone: '0723456789',
      address: 'Nakuru',
      role: 'user',
      verification_code: 'ABC123',
      is_verified: false,
    };

    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn(() => ({
        returning: jest.fn().mockResolvedValueOnce([{ ...user, user_id: 2 }])
      }))
    });

    const result = await userService.create(user);
    expect(result?.email).toBe('alice@example.com');
  });

  it('should throw "Email already exists" if duplicate email in create', async () => {
    const error = new Error('Duplicate') as any;
    error.code = '23505';
    (db.insert as jest.Mock).mockImplementationOnce(() => {
      throw error;
    });

    const user = { email: 'exists@example.com' } as TIUser;

    await expect(userService.create(user)).rejects.toThrow('Email already exists');
  });

  it('should rethrow unknown error in create', async () => {
    const error = new Error('DB exploded') as any;
    error.code = 'SOMETHING_ELSE';

    (db.insert as jest.Mock).mockImplementationOnce(() => {
      throw error;
    });

    const user = { email: 'fail@example.com' } as TIUser;

    await expect(userService.create(user)).rejects.toThrow('DB exploded');
  });

  // Update user
  it('should update a user', async () => {
    const updateData = { firstname: 'Updated' };
    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn(() => ({
        where: jest.fn(() => ({
          returning: jest.fn().mockResolvedValueOnce([{ user_id: 1, ...updateData }])
        }))
      }))
    });

    const result = await userService.update(1, updateData);
    expect(result?.firstname).toBe('Updated');
  });

  it('should throw "Email already exists" if duplicate email in update', async () => {
    const error = new Error('Duplicate update') as any;
    error.code = '23505';

    (db.update as jest.Mock).mockImplementationOnce(() => {
      throw error;
    });

    await expect(userService.update(1, { email: 'exists@example.com' })).rejects.toThrow('Email already exists');
  });

  it('should rethrow unknown error in update', async () => {
    const error = new Error('Unknown update error') as any;
    error.code = 'SOME_ERROR';

    (db.update as jest.Mock).mockImplementationOnce(() => {
      throw error;
    });

    await expect(userService.update(1, { email: 'test@unknown.com' })).rejects.toThrow('Unknown update error');
  });

  // Delete user
  it('should delete a user and return true', async () => {
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn(() => ({
        returning: jest.fn().mockResolvedValueOnce([{ user_id: 1 }])
      }))
    });

    const result = await userService.remove(1);
    expect(result).toBe(true);
  });

  it('should return false if no user was deleted', async () => {
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn(() => ({
        returning: jest.fn().mockResolvedValueOnce([])
      }))
    });

    const result = await userService.remove(999);
    expect(result).toBe(false);
  });

  // Email exists
  it('should return true if email exists', async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn(() => ({
        where: jest.fn().mockResolvedValueOnce([{ userID: 1 }])
      }))
    });

    const result = await userService.emailExists('existing@example.com');
    expect(result).toBe(true);
  });

  it('should return false if email does not exist', async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn(() => ({
        where: jest.fn().mockResolvedValueOnce([])
      }))
    });

    const result = await userService.emailExists('notfound@example.com');
    expect(result).toBe(false);
  });
});
