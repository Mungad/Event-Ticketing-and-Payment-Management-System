import { Express } from 'express';
import {
  getAllSupportTickets,
  getSupportTicketById,
  createSupportTicket,
  updateSupportTicket,
  deleteSupportTicket,
} from './supportTicket.controller';

const supportTicketRoutes = (app: Express) => {
  // Get all support tickets
  app.get('/support-tickets', async (req, res, next) => {
    try {
      await getAllSupportTickets(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get ticket by ID
  app.get('/support-tickets/:id', async (req, res, next) => {
    try {
      await getSupportTicketById(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Create ticket
  app.post('/support-tickets', async (req, res, next) => {
    try {
      await createSupportTicket(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update ticket
  app.put('/support-tickets/:id', async (req, res, next) => {
    try {
      await updateSupportTicket(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete ticket
  app.delete('/support-tickets/:id', async (req, res, next) => {
    try {
      await deleteSupportTicket(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default supportTicketRoutes;
