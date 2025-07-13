import { Express } from 'express';
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} from './payment.controller';

import { adminOnly, authenticated } from "../middleware/bearAuth";

const paymentRoutes = (app: Express) => {
  // Get all payments
  app.get('/payments',
    adminOnly,
     async (req, res, next) => {
    try {
      await getAllPayments(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get payment by ID
  app.get('/payments/:id', 
    adminOnly,
    async (req, res, next) => {
    try {
      await getPaymentById(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Create payment(user)
  app.post('/payments', async (req, res, next) => {
    try {
      await createPayment(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update payment
  app.put('/payments/:id', 
    adminOnly,
    async (req, res, next) => {
    try {
      await updatePayment(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete payment
  app.delete('/payments/:id', 
    adminOnly,
    async (req, res, next) => {
    try {
      await deletePayment(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default paymentRoutes;
