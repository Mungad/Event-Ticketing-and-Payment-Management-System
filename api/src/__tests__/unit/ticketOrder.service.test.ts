import * as ticketOrderService from '../../ticketOrders/ticketOrder.service';
import db from '../../drizzle/db';
import { TicketOrdersTable, TITicketOrder, TSTicketOrder } from '../../drizzle/schema';

jest.mock('../../drizzle/db', () => ({
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

describe('ticketOrder.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockOrder: TSTicketOrder = {
    order_id: 1,
    user_id: 3,
    event_id: 2,
    quantity: 2,
    total_price: '5000.00',
    payment_status: 'Pending',
    order_date: new Date('2025-07-10T08:00:00Z'),
  };

  it('should get all ticket orders', async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockResolvedValueOnce([mockOrder]),
    });

    const result = await ticketOrderService.getAll();
    expect(result).toEqual([mockOrder]);
  });

  it('should get ticket order by ID', async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValueOnce([mockOrder]),
      }),
    });

    const result = await ticketOrderService.getById(1);
    expect(result).toEqual(mockOrder);
  });

  it('should create a new ticket order', async () => {
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([mockOrder]),
      }),
    });

    const newOrder: TITicketOrder = {
      user_id: 3,
      event_id: 2,
      quantity: 2,
      total_price: '5000.00',
      payment_status: 'Pending',
    };

    const result = await ticketOrderService.create(newOrder);
    expect(result).toEqual(mockOrder);
  });

  it('should update a ticket order', async () => {
    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([mockOrder]),
        }),
      }),
    });

    const result = await ticketOrderService.update(1, { quantity: 3 });
    expect(result).toEqual(mockOrder);
  });

  it('should delete a ticket order', async () => {
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([mockOrder]),
      }),
    });

    const result = await ticketOrderService.remove(1);
    expect(result).toBe(true);
  });

  it('should return false if no ticket order was deleted', async () => {
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([]),
      }),
    });

    const result = await ticketOrderService.remove(99);
    expect(result).toBe(false);
  });
});
