import { Request, Response } from 'express';
import * as userService from './user.service';

// GET all users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAll();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const user = await userService.getById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = {
      ...req.body,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const newUser = await userService.create(userData);
    if (!newUser) {
      return res.status(400).json({ error: "User creation failed" });
    }

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const updateData = {
      ...req.body,
      updated_at: new Date(),
    };

    const updated = await userService.update(userId, updateData);
    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updated,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const deleted = await userService.remove(userId);

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
