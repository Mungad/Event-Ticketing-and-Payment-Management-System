import * as paymentService from '../../payments/payment.service';
import db from '../../drizzle/db';
import { TIPayment, TSPayment } from '../../drizzle/schema';

jest.mock('../../drizzle/db', () => ({
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

describe('payment.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPayment: TSPayment = {
    payment_id: 1,
    order_id: 6,
    user_id: 3,
    event_id: 9,
    amount: '5000.00',
    payment_status: 'Completed',
    payment_date: new Date('2025-07-10T10:00:00Z'),
    payment_method: 'M-Pesa',
    transaction_id: 'MP123456',
    created_at: new Date('2025-07-10T10:00:00Z'),
    updated_at: new Date('2025-07-10T10:00:00Z'),
  };

  it('should return all payments', async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockResolvedValueOnce([mockPayment]),
    });

    const result = await paymentService.getAll();
    expect(result).toEqual([mockPayment]);
  });

  it('should return a payment by ID', async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValueOnce([mockPayment]),
      }),
    });

    const result = await paymentService.getById(1);
    expect(result).toEqual(mockPayment);
  });

  it('should create a payment', async () => {
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([mockPayment]),
      }),
    });

    const newPayment: TIPayment = {
      order_id: 6,
      user_id: 3,
      event_id: 9,
      amount: '5000.00',
      payment_status: 'Completed',
      payment_method: 'M-Pesa',
      transaction_id: 'MP123456',
    };

    const result = await paymentService.create(newPayment);
    expect(result).toEqual(mockPayment);
  });

  it('should update a payment', async () => {
    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([mockPayment]),
        }),
      }),
    });

    const result = await paymentService.update(1, { payment_status: 'Completed' });
    expect(result).toEqual(mockPayment);
  });

  it('should delete a payment and return true', async () => {
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([mockPayment]),
      }),
    });

    const result = await paymentService.remove(1);
    expect(result).toBe(true);
  });

  it('should return false if no payment was deleted', async () => {
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([]),
      }),
    });

    const result = await paymentService.remove(99);
    expect(result).toBe(false);
  });
});
