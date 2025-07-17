import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import * as userService from './user.service';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail, sendVerificationEmail } from '../mailer/email.service';

// GET all users (Admin only)
export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await userService.getAll();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// GET user by ID (Admin or self)
export const getUserById = async (req: Request, res: Response) => {
    try {
        const requestedId = Number(req.params.id);
        const user = (req as any).user;

        if (user.role !== 'admin' && user.user_id !== requestedId) {
            return res.status(403).json({ error: "Access denied" });
        }

        const foundUser = await userService.getById(requestedId);
        if (!foundUser) {
            return res.status(404).json({ error: "User not found" });
        }

//remove password
        const { password, ...userData } = foundUser;
        res.status(200).json(userData);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// CREATE new user (Registration)
export const createUser = async (req: Request, res: Response) => {
    try {
        const { password, ...userData } = req.body;

        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUserData = {
            ...userData,
            password: hashedPassword,
            role: 'user',
            verification_code: verificationCode,
            is_verified: false
        };

        const newUser = await userService.create(newUserData);
        if (!newUser) {
            return res.status(400).json({ error: "User registration failed" });
        }

        const userName = `${newUser.firstname} ${newUser.lastname}`;
        sendVerificationEmail(newUser.email, userName, verificationCode)
            .then(() => console.log(`Verification email sent to ${newUser.email}`))
            .catch(err => console.error('Verification email send failed:', err.message));

        res.status(201).json({
            message: "User registered successfully. Please check your email for verification code.",
            user: {
                user_id: newUser.user_id,
                first_name: newUser.firstname,
                last_name: newUser.lastname,
                email: newUser.email,
                role: newUser.role,
                is_verified: newUser.is_verified
            }
        });
    } catch (error: any) {
        if (error.message.includes('Email already exists')) {
            return res.status(400).json({ error: "Email already registered" });
        }
        res.status(500).json({ error: error.message });
    }
};

// Verify email with code
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { email, verificationCode } = req.body;

        if (!email || !verificationCode) {
            return res.status(400).json({ error: "Email and verification code are required" });
        }

        const user = await userService.getByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.is_verified) {
            return res.status(400).json({ error: "Email already verified" });
        }

        if (user.verification_code !== verificationCode) {
            return res.status(400).json({ error: "Invalid verification code" });
        }

        const updated = await userService.update(user.user_id, {
            is_verified: true,
            verification_code: null
        });

        if (updated) {
            const userName = `${user.firstname} ${user.lastname}`;
            sendWelcomeEmail(user.email, userName)
                .then(() => console.log(`Welcome email sent to ${user.email}`))
                .catch(err => console.error('Welcome email send failed:', err.message));
        }

        res.status(200).json({
            message: "Email verified successfully",
            user: {
                user_id: updated?.user_id,
                first_name: updated?.firstname,
                last_name: updated?.lastname,
                email: updated?.email,
                role: updated?.role,
                is_verified: updated?.is_verified
            }
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// CREATE admin (One-time setup - remove route after use)
export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { password, ...adminData } = req.body;

        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newAdminData = {
            ...adminData,
            password: hashedPassword,
            role: 'admin',
            is_verified: true
        };

        const newAdmin = await userService.create(newAdminData);
        if (!newAdmin) {
            return res.status(400).json({ error: "Admin creation failed" });
        }

        const adminName = `${newAdmin.firstname} ${newAdmin.lastname}`;
        sendWelcomeEmail(newAdmin.email, adminName)
            .then(() => console.log(`Welcome email sent to admin ${newAdmin.email}`))
            .catch(err => console.error('Admin email send failed:', err.message));

        res.status(201).json({
            message: "Admin created successfully",
            admin: {
                user_id: newAdmin.user_id,
                first_name: newAdmin.firstname,
                last_name: newAdmin.lastname,
                email: newAdmin.email,
                role: newAdmin.role,
                is_verified: newAdmin.is_verified
            }
        });
    } catch (error: any) {
        if (error.message.includes('Email already exists')) {
            return res.status(400).json({ error: "Email already registered" });
        }
        res.status(500).json({ error: error.message });
    }
};

// User login (works for both users and admins)
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await userService.getByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        if (user.role !== 'admin' && !user.is_verified) {
            return res.status(401).json({ error: "Please verify your email before logging in" });
        }

        const passwordMatch = bcrypt.compareSync(password, user.password as string);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET not configured");
        }

        const payload = {
            sub: user.user_id,
            user_id: user.user_id,
            first_name: user.firstname,
            last_name: user.lastname,
            email: user.email,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 3)
        };

        const token = jwt.sign(payload, secret);

        const responseMessage = user.role === 'admin' ? "Admin login successful" : "User login successful";
        const userKey = user.role === 'admin' ? "admin" : "user";

        res.status(200).json({
            message: responseMessage,
            token,
            [userKey]: {
                user_id: user.user_id,
                first_name: user.firstname,
                last_name: user.lastname,
                email: user.email,
                role: user.role,
                is_verified: user.is_verified
            }
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const loginCustomer = loginUser;

// UPDATE user (Admin or User)
export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        const user = (req as any).user;
        const updateData = { ...req.body };

        if (user.role !== 'admin' && user.user_id !== userId) {
            return res.status(403).json({ error: "Access denied" });
        }

        if (updateData.password) {
            updateData.password = bcrypt.hashSync(updateData.password, 10);
        }

        if (user.role !== 'admin') {
            delete updateData.role;
            delete updateData.is_verified;
            delete updateData.verification_code;
        }

        const updated = await userService.update(userId, updateData);
        if (!updated) {
            return res.status(404).json({ error: "User not found" });
        }

        const { password, ...userData } = updated;
        res.status(200).json({
            message: "User updated successfully",
            user: userData
        });
    } catch (error: any) {
        if (error.message.includes('Email already exists')) {
            return res.status(400).json({ error: "Email already in use" });
        }
        res.status(500).json({ error: error.message });
    }
};

// DELETE user (Admin only)
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
