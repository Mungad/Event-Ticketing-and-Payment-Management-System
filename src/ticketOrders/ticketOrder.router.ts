import { Express } from 'express';
import {
  getAllTicketOrders,
  getTicketOrderById,
  createTicketOrder,
  updateTicketOrder,
  deleteTicketOrder,
} from './ticketOrder.controller';

const ticketOrderRoutes = (app: Express) => {
  // Get all ticket orders
  app.get('/ticket-orders', async (req, res, next) => {
    try {
      await getAllTicketOrders(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get order by ID
  app.get('/ticket-orders/:id', async (req, res, next) => {
    try {
      await getTicketOrderById(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Create order
  app.post('/ticket-orders', async (req, res, next) => {
    try {
      await createTicketOrder(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update order
  app.put('/ticket-orders/:id', async (req, res, next) => {
    try {
      await updateTicketOrder(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete order
  app.delete('/ticket-orders/:id', async (req, res, next) => {
    try {
      await deleteTicketOrder(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default ticketOrderRoutes;
