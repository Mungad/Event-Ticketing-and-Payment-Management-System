import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Request payload: What the user sends when placing a ticket order
export type TTicketOrderRequest = {
  event_id: number;
  quantity: number;
};

// Response payload: What the backend returns
export type TTicketOrderResponse = {
  order_id: number;
  user_id: number;
  event_id: number;
  quantity: number;
  total_price: string;
  payment_status: "Pending" | "Completed" | "Failed";
  order_date: string;
};

export const ticketOrderAPI = createApi({
  reducerPath: "ticketOrderAPI",
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
  tagTypes: ["TicketOrder"],
  endpoints: (builder) => ({
    // User places a new ticket order (POST /ticket-orders)
    placeTicketOrder: builder.mutation<
      TTicketOrderResponse,
      TTicketOrderRequest
    >({
      query: (order) => ({
        url: "/ticket-orders",
        method: "POST",
        body: order, // user_id inferred from token
      }),
      invalidatesTags: ["TicketOrder"],
    }),

    // Get all orders by a specific user (GET /ticket-orders/user/:userId)
    getUserOrders: builder.query<TTicketOrderResponse[], number>({
      query: (userId) => `/ticket-orders/user/${userId}`,
      providesTags: ["TicketOrder"],
    }),

    // Admin: Get all ticket orders (GET /ticket-orders)
    getAllTicketOrders: builder.query<TTicketOrderResponse[], void>({
      query: () => "/ticket-orders",
      providesTags: ["TicketOrder"],
    }),

    // Get a single ticket order by ID (GET /ticket-orders/:id)
    getTicketOrderById: builder.query<TTicketOrderResponse, number>({
      query: (orderId) => `/ticket-orders/${orderId}`,
      providesTags: ["TicketOrder"],
    }),

    // Admin: Update the payment status of a ticket order (PUT /ticket-orders/:id)
    updatePaymentStatus: builder.mutation<
      TTicketOrderResponse,
      { orderId: number; payment_status: "Pending" | "Completed" | "Failed" }
    >({
      query: ({ orderId, payment_status }) => ({
        url: `/ticket-orders/${orderId}`,
        method: "PUT",
        body: { payment_status },
      }),
      invalidatesTags: ["TicketOrder"],
    }),
  }),
});

export const {
  usePlaceTicketOrderMutation,
  useGetUserOrdersQuery,
  useGetAllTicketOrdersQuery,
  useGetTicketOrderByIdQuery,
  useUpdatePaymentStatusMutation,
} = ticketOrderAPI;
