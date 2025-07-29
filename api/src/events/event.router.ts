import { Express } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from './event.controller';

import { adminOnly } from "../middleware/bearAuth";

const eventRoutes = (app: Express) => {
  // Get all events(public)
  app.get('/events', async (req, res, next) => {
    try {
      await getAllEvents(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get event by ID(public)
  app.get('/events/:id', async (req, res, next) => {
    try {
      await getEventById(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Create new event(Admin only)
  app.post('/events',
    //adminOnly,
     async (req, res, next) => {
    try {
      await createEvent(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update event
  app.put('/events/:id', 
    adminOnly,
    async (req, res, next) => {
    try {
      await updateEvent(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete event
  app.delete('/events/:id', 
    adminOnly,
    async (req, res, next) => {
    try {
      await deleteEvent(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default eventRoutes;
