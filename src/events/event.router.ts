import { Express } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from './event.controller';

const eventRoutes = (app: Express) => {
  // Get all events
  app.get('/events', async (req, res, next) => {
    try {
      await getAllEvents(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get event by ID
  app.get('/events/:id', async (req, res, next) => {
    try {
      await getEventById(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Create new event
  app.post('/events', async (req, res, next) => {
    try {
      await createEvent(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update event
  app.put('/events/:id', async (req, res, next) => {
    try {
      await updateEvent(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete event
  app.delete('/events/:id', async (req, res, next) => {
    try {
      await deleteEvent(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default eventRoutes;
