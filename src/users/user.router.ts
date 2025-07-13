import { Express } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  createAdmin,
  verifyEmail,
} from "./user.controller";
import {
  adminOnly,
  authenticated,
} from "../middleware/bearAuth";

const userRoutes = (app: Express) => {
  // User registration
  app.post("/users", async (req, res, next) => {
    try {
      await createUser(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Email verification
  app.post("/users/verify", async (req, res, next) => {
    try {
      await verifyEmail(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Login (User or Admin)
  app.post("/users/login", async (req, res, next) => {
    try {
      await loginUser(req, res);
    } catch (error) {
      next(error);
    }
  });

  // One-time Admin creation route (optional)
  app.post("/admin/create", async (req, res, next) => {
    try {
      await createAdmin(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get all users (Admin only)
  app.get("/users", adminOnly, async (req, res, next) => {
    try {
      await getAllUsers(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get user by ID (Self or Admin)
  app.get("/users/:id", authenticated, async (req, res, next) => {
    try {
      await getUserById(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update user (Self or Admin)
  app.put("/users/:id", authenticated, async (req, res, next) => {
    try {
      await updateUser(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete user (Admin only)
  app.delete("/users/:id", adminOnly, async (req, res, next) => {
    try {
      await deleteUser(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default userRoutes;
