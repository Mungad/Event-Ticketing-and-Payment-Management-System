import { Express } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./user.controller";

const userRoutes = (app: Express) => {
  // Create user
  app.post("/users", async (req, res, next) => {
    try {
      await createUser(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get all users
  app.get("/users", async (req, res, next) => {
    try {
      await getAllUsers(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get user by ID
  app.get("/users/:id", async (req, res, next) => {
    try {
      await getUserById(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update user
  app.put("/users/:id", async (req, res, next) => {
    try {
      await updateUser(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete user
  app.delete("/users/:id", async (req, res, next) => {
    try {
      await deleteUser(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default userRoutes;
