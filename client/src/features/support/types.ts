export type TSupportTicket = {
  ticket_id: number;
  user_id: number;
  subject: string | null;
  description: string | null;
  status: "Open" | "Closed" | "Pending";
  created_at: string;
  updated_at?: string;
};
