import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";
import type { TEvent } from "./types"; 


export const eventsAPI = createApi({
  reducerPath: "eventsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Events"],
  endpoints: (builder) => ({
    getEvents: builder.query<{ data: TEvent[] }, void>({
      query: () => "/events",
      providesTags: ["Events"],
    }),
    createEvent: builder.mutation<TEvent, Partial<TEvent>>({
      query: (newEvent) => ({
        url: "/event",
        method: "POST",
        body: newEvent,
      }),
      invalidatesTags: ["Events"],
    }),
    updateEvent: builder.mutation<TEvent, Partial<TEvent> & { id: number }>({
      query: ({ id, ...rest }) => ({
        url: `/event/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Events"],
    }),
    deleteEvent: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/event/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventsAPI;
