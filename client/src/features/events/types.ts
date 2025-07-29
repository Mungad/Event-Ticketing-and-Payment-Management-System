export type TEvent = {
  event_id: number;
  title: string;
  description: string;
  venue_id: number;
  date: string;
  time: string;
  category: string;
  tickets_sold: number;
  tickets_total: number;
  ticket_price: number;
  createdAt: string;
  updatedAt?: string;
  img_url: string;
};
