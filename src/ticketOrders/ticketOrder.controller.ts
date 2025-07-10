import { Request, Response } from 'express';
import * as ticketOrderService from './ticketOrder.service';

// GET all ticket orders
export const getAllTicketOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await ticketOrderService.getAll();
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET ticket order by ID
export const getTicketOrderById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const order = await ticketOrderService.getById(id);

    if (!order) {
      return res.status(404).json({ error: 'Ticket order not found' });
    }

    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE ticket order
export const createTicketOrder = async (req: Request, res: Response) => {
  try {
    const orderData = {
      ...req.body,
      order_date: new Date(),
    };

    const newOrder = await ticketOrderService.create(orderData);
    if (!newOrder) {
      return res.status(400).json({ error: 'Ticket order creation failed' });
    }

    res.status(201).json({
      message: 'Ticket order created successfully',
      order: newOrder,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE ticket order
export const updateTicketOrder = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updateData = {
      ...req.body,
      order_date: new Date(),
    };

    const updated = await ticketOrderService.update(id, updateData);
    if (!updated) {
      return res.status(404).json({ error: 'Ticket order not found' });
    }

    res.status(200).json({
      message: 'Ticket order updated successfully',
      order: updated,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE ticket order
export const deleteTicketOrder = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await ticketOrderService.remove(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Ticket order not found' });
    }

    res.status(200).json({ message: 'Ticket order deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
