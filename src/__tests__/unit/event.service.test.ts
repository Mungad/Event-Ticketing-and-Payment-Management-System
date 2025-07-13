import * as eventService from '../../events/event.service';
import db from '../../drizzle/db';
import { EventsTable, TIEvent, TSEvent } from '../../drizzle/schema';

jest.mock('../../drizzle/db', () => ({
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

describe('event.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockEvent: TSEvent = {
    event_id: 1,
    title: 'Live Concert',
    description: 'Exciting event with music',
    venue_id: 2,
    category: 'Music',
    date: new Date('2025-08-01T18:00:00Z'),
    time: '18:00',
    ticket_price: '2500.00',
    tickets_total: 100,
    tickets_sold: 0,
    created_at: new Date(),
    updated_at: new Date()
  };

  it('should get all events', async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockResolvedValueOnce([mockEvent])
    });

    const result = await eventService.getAll();
    expect(result).toEqual([mockEvent]);
  });

  it('should get event by ID', async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValueOnce([mockEvent])
      })
    });

    const result = await eventService.getById(1);
    expect(result).toEqual(mockEvent);
  });

  it('should create a new event', async () => {
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([mockEvent])
      })
    });

    const newEvent: TIEvent = {
      title: 'Live Concert',
      description: 'Exciting event with music',
      venue_id: 2,
      category: 'Music',
      date: new Date('2025-08-01T18:00:00Z'),
      time: '18:00',
      ticket_price: '2500.00',
      tickets_total: 100,
    };

    const result = await eventService.create(newEvent);
    expect(result).toEqual(mockEvent);
  });

  it('should update an event', async () => {
    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([mockEvent])
        })
      })
    });

    const result = await eventService.update(1, { title: 'Updated Concert' });
    expect(result).toEqual(mockEvent);
  });

  it('should delete an event', async () => {
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([mockEvent])
      })
    });

    const result = await eventService.remove(1);
    expect(result).toBe(true);
  });

  it('should return false if no event was deleted', async () => {
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([])
      })
    });

    const result = await eventService.remove(999);
    expect(result).toBe(false);
  });
});
