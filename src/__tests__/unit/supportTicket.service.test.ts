import * as supportTicketService from '../../supportTickets/supportTicket.service';
import db from '../../drizzle/db';
import { TISupportTicket, TSSupportTicket } from '../../drizzle/schema';

jest.mock('../../drizzle/db', () => ({
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

describe('supportTicket.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTicket: TSSupportTicket = {
    ticket_id: 1,
    user_id: 4,
    subject: 'Payment Issue',
    description: 'I paid but haven’t received ticket',
    status: 'Open',
    created_at: new Date('2025-07-10T10:00:00Z'),
    updated_at: new Date('2025-07-10T10:00:00Z'),
  };

  it('should return all support tickets', async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockResolvedValueOnce([mockTicket]),
    });

    const result = await supportTicketService.getAll();
    expect(result).toEqual([mockTicket]);
  });

  it('should return a support ticket by ID', async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValueOnce([mockTicket]),
      }),
    });

    const result = await supportTicketService.getById(1);
    expect(result).toEqual(mockTicket);
  });

  it('should create a support ticket', async () => {
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([mockTicket]),
      }),
    });

    const newTicket: TISupportTicket = {
      user_id: 4,
      subject: 'Payment Issue',
      description: 'I paid but haven’t received ticket',
    };

    const result = await supportTicketService.create(newTicket);
    expect(result).toEqual(mockTicket);
  });

  it('should update a support ticket', async () => {
    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([mockTicket]),
        }),
      }),
    });

    const result = await supportTicketService.update(1, { status: 'Resolved' });
    expect(result).toEqual(mockTicket);
  });

  it('should delete a support ticket and return true', async () => {
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([mockTicket]),
      }),
    });

    const result = await supportTicketService.remove(1);
    expect(result).toBe(true);
  });

  it('should return false if no ticket was deleted', async () => {
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([]),
      }),
    });

    const result = await supportTicketService.remove(999);
    expect(result).toBe(false);
  });
});
