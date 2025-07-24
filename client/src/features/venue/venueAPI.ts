import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";
import type { TVenue } from "./types";

export const venuesAPI = createApi({
  reducerPath: "venuesAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Venues"],
  endpoints: (builder) => ({
    getVenues: builder.query<TVenue[], void>({
      query: () => "/Venues",
      providesTags: ["Venues"],
    }),
    createVenue: builder.mutation<TVenue, Partial<TVenue>>({
      query: (newVenue) => ({
        url: "/venues",
        method: "POST",
        body: newVenue,
      }),
      invalidatesTags: ["Venues"],
    }),
    // updateVenue: builder.mutation<TVenue, Partial<TVenue> & { venue_id: number }>({
    //   query: ({ venue_id, ...rest }) => ({
    //     url: `/venues/${venue_id}`,
    //     method: "PUT",
    //     body: rest,
    //   }),
    //   invalidatesTags: ["Venues"],
    // }),
    deleteVenue: builder.mutation<{ success: boolean; venue_id: number }, number>({
      query: (venue_id) => ({
        url: `/venues/${venue_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Venues"],
    }),
  }),
});

export const {
  useGetVenuesQuery,
  useCreateVenueMutation,
  //useUpdateVenueMutation,
  useDeleteVenueMutation,
} = venuesAPI;
