import * as venueService from '../../venues/venue.service';
import db from '../../drizzle/db';
import { TIVenue, TSVenue } from '../../drizzle/schema';

jest.mock('../../drizzle/db', () => ({
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

describe('venue.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockVenue: TSVenue = {
    venue_id: 1,
    name: 'KICC',
    address: 'Nairobi CBD',
    capacity: 1000,
    created_at: new Date(),
  };

  // getAll
  it('should get all venues', async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockResolvedValueOnce([mockVenue])
    });

    const result = await venueService.getAll();
    expect(result).toEqual([mockVenue]);
  });

  it('should throw an error if getAll fails', async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockRejectedValueOnce(new Error('DB error')),
    });

    await expect(venueService.getAll()).rejects.toThrow('Failed to get venues');
  });

  // getById
  it('should get venue by ID', async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValueOnce([mockVenue])
      })
    });

    const result = await venueService.getById(1);
    expect(result).toEqual(mockVenue);
  });

  it('should throw an error if getById fails', async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockRejectedValueOnce(new Error('DB error')),
      }),
    });

    await expect(venueService.getById(99)).rejects.toThrow('Failed to get venue by ID');
  });

  // create
  it('should create a new venue', async () => {
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([mockVenue])
      })
    });

    const newVenue: TIVenue = {
      name: 'KICC',
      address: 'Nairobi CBD',
      capacity: 1000,
    };

    const result = await venueService.create(newVenue);
    expect(result).toEqual(mockVenue);
  });

  it('should throw an error if create fails', async () => {
    (db.insert as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Insert failed');
    });

    const venue: TIVenue = {
      name: 'Test',
      address: 'Fail Street',
      capacity: 200,
    };

    await expect(venueService.create(venue)).rejects.toThrow('Failed to create venue');
  });

  // update
  it('should update a venue', async () => {
    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([mockVenue])
        })
      })
    });

    const result = await venueService.update(1, { name: 'Updated KICC' });
    expect(result).toEqual(mockVenue);
  });

  it('should throw an error if update fails', async () => {
    (db.update as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Update failed');
    });

    await expect(venueService.update(1, { name: 'Fail Venue' })).rejects.toThrow('Failed to update venue');
  });

  // remove
  it('should delete a venue', async () => {
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([mockVenue])
      })
    });

    const result = await venueService.remove(1);
    expect(result).toBe(true);
  });

  it('should return false if no venue was deleted', async () => {
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([])
      })
    });

    const result = await venueService.remove(999);
    expect(result).toBe(false);
  });

  it('should throw an error if remove fails', async () => {
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockRejectedValueOnce(new Error('Delete failed'))
      })
    });

    await expect(venueService.remove(1)).rejects.toThrow('Failed to delete venue');
  });
});
