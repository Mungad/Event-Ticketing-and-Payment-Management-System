import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Request payload (what the user sends when submitting a ticket)
export type TSupportTicketRequest = {
  subject: string;
  description: string;
};

// Response shape (what the backend sends back)
export type TSupportTicketResponse = {
  ticket_id: number;
  user_id: number;
  subject: string;
  description: string;
  status: "Open" | "Closed" | "Pending";
  created_at: string;
  updated_at: string;
};

export const supportAPI = createApi({
  reducerPath: "supportAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8088",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["SupportTicket"],
  endpoints: (builder) => ({
    // User submits a new support ticket (POST /support-tickets)
    submitSupportTicket: builder.mutation<
      TSupportTicketResponse,
      TSupportTicketRequest
    >({
      query: (ticket) => ({
        url: "/support-tickets",
        method: "POST",
        body: ticket, // user_id will be extracted from token on the backend
      }),
      invalidatesTags: ["SupportTicket"],
    }),

    // Get all tickets submitted by a specific user (GET /support-tickets/user/:userId)
    getUserTickets: builder.query<TSupportTicketResponse[], number>({
      query: (userId) => `/support-tickets/user/${userId}`,
      providesTags: ["SupportTicket"],
    }),

    // (Optional) Admin: Get all support tickets (GET /support-tickets)
    getAllTickets: builder.query<TSupportTicketResponse[], void>({
      query: () => "/support-tickets",
      providesTags: ["SupportTicket"],
    }),

    // (Optional) Admin/User: Get single support ticket by ID (GET /support-tickets/:id)
    getSupportTicketById: builder.query<TSupportTicketResponse, number>({
      query: (ticketId) => `/support-tickets/${ticketId}`,
      providesTags: ["SupportTicket"],
    }),

    // (Optional) Admin: Update status (PUT /support-tickets/:id)
    updateTicketStatus: builder.mutation<
      TSupportTicketResponse,
      { ticketId: number; status: "Open" | "Closed" | "Pending" }
    >({
      query: ({ ticketId, status }) => ({
        url: `/support-tickets/${ticketId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["SupportTicket"],
    }),
  }),
});

export const {
  useSubmitSupportTicketMutation,
  useGetUserTicketsQuery,
  useGetAllTicketsQuery,
  useGetSupportTicketByIdQuery,
  useUpdateTicketStatusMutation,
} = supportAPI;
