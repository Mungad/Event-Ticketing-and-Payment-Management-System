import { Express } from 'express';
import {
  getAllSupportTickets,
  getSupportTicketById,
  createSupportTicket,
  updateSupportTicket,
  deleteSupportTicket,
} from './supportTicket.controller';

import { adminOnly, authenticated } from "../middleware/bearAuth";

const supportTicketRoutes = (app: Express) => {
  // Get all support tickets
  app.get('/support-tickets', 
    //adminOnly,
    async (req, res, next) => {
    try {
      await getAllSupportTickets(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get ticket by ID
  app.get('/support-tickets/:id',
    //authenticated,
     async (req, res, next) => {
    try {
      await getSupportTicketById(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Create ticket(users)
  app.post('/support-tickets',
    //authenticated,
     async (req, res, next) => {
    try {
      await createSupportTicket(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update ticket
  app.put('/support-tickets/:id', 
    authenticated,
    async (req, res, next) => {
    try {
      await updateSupportTicket(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete ticket(user)
  app.delete('/support-tickets/:id', 
    authenticated,
    async (req, res, next) => {
    try {
      await deleteSupportTicket(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default supportTicketRoutes;
