import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../../src/utils/ApiDomain";
import type { RootState } from "../../app/store";


export type TUser = {
  customerID: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  image_url: string;
};

export const usersAPI = createApi({
  reducerPath: 'usersAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers, { getState }) => {
          const token = (getState() as RootState).user.token;
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          headers.set("Content-Type", "application/json");
          return headers;
        },
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    // POST auth register
    createUsers: builder.mutation<TUser, Partial<TUser>>({
      query: (newUser) => ({
        url: '/users',
        method: 'POST',
        body: newUser
      }),
      invalidatesTags: ['Users']
    }),

    // POST auth verify
    verifyUser: builder.mutation<{ message: string }, { email: string; code: string }>({
      query: (data) => ({
        url: '/users/verify',
        method: 'POST',
        body: data,
      }),
    }),

    // POST auth login
    loginUser: builder.mutation<{ token: string; user: TUser }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // GET all users
    getUsers: builder.query<TUser[], void>({
      query: () => '/users',
      transformResponse: (response: { data: TUser[] }) => response.data,
      providesTags: ['Users']
    }),
    
    // GET /customer/:id
    getUserById: builder.query<TUser, number>({
      query: (id) => `/users/${id}`,
      transformResponse: (response: { data: TUser }) => response.data,
    }),

    // PUT /customer/:id
    updateUser: builder.mutation<TUser, Partial<TUser> & { id: number }>({
      query: ({ id, ...rest }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: ['Users']
    }),

    // DELETE /customer/:id
    deleteUser: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users']
    }),

    // // GET /customer/bookings-payments/:id
    // getCustomerBookingsAndPayments: builder.query<any, number>({
    //   query: (id) => `/customer/bookings-payments/${id}`,
    //   transformResponse: (response: { data: any[] }) => response.data,
    // }),

    // // GET /customers/bookings-payments
    // getAllCustomerBookingsAndPayments: builder.query<any[], void>({
    //   query: () => `/customers/bookings-payments`,
    //   transformResponse: (response: { data: any[] }) => response.data,
    // }),
  }),
});

export const {
  useCreateUsersMutation,
  useVerifyUserMutation,
  useLoginUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
//   useGetCustomerBookingsAndPaymentsQuery,
//   useGetAllCustomerBookingsAndPaymentsQuery,
} = usersAPI;