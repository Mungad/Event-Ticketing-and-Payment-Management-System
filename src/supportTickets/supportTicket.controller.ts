import { Request, Response } from 'express';
import * as supportTicketService from './supportTicket.service';

// GET all support tickets
export const getAllSupportTickets = async (_req: Request, res: Response) => {
  try {
    const tickets = await supportTicketService.getAll();
    res.status(200).json(tickets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// GET support ticket by ID
export const getSupportTicketById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const ticket = await supportTicketService.getById(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Support ticket not found' });
    }

    res.status(200).json(ticket);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE support ticket
export const createSupportTicket = async (req: Request, res: Response) => {
  try {
    const ticketData = {
      ...req.body,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const newTicket = await supportTicketService.create(ticketData);
    if (!newTicket) {
      return res.status(400).json({ error: 'Support ticket creation failed' });
    }

    res.status(201).json({
      message: 'Support ticket created successfully',
      ticket: newTicket,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE support ticket
export const updateSupportTicket = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updateData = {
      ...req.body,
      updated_at: new Date(),
    };

    const updated = await supportTicketService.update(id, updateData);
    if (!updated) {
      return res.status(404).json({ error: 'Support ticket not found' });
    }

    res.status(200).json({
      message: 'Support ticket updated successfully',
      ticket: updated,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE support ticket
export const deleteSupportTicket = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await supportTicketService.remove(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Support ticket not found' });
    }

    res.status(200).json({ message: 'Support ticket deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
