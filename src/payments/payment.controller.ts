import { Request, Response } from 'express';
import * as paymentService from './payment.service';

// GET all payments
export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const payments = await paymentService.getAll();
    res.status(200).json(payments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET payment by ID
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const payment = await paymentService.getById(id);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.status(200).json(payment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE payment
export const createPayment = async (req: Request, res: Response) => {
  try {
    const paymentData = {
      ...req.body,
      payment_date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const newPayment = await paymentService.create(paymentData);
    if (!newPayment) {
      return res.status(400).json({ error: 'Payment creation failed' });
    }

    res.status(201).json({
      message: 'Payment created successfully',
      payment: newPayment,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE payment
export const updatePayment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updateData = {
      ...req.body,
      updated_at: new Date(),
    };

    const updated = await paymentService.update(id, updateData);
    if (!updated) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.status(200).json({
      message: 'Payment updated successfully',
      payment: updated,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE payment
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await paymentService.remove(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
