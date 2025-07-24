export type TEvent = {
  event_id: number;
  title: string;
  description: string;
  venueId: number;
  date: string;
  category: string;
  tickets_sold: number;
  tickets_total: number;
  ticket_price: number;
  createdAt: string;
  updatedAt?: string;
};
