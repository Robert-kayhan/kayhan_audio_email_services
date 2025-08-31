import { apiSlice } from "../apiSlcie"; // Adjust path accordingly
import { BOOKING_URL } from "../../constant"; // e.g. "/api/flyers"

const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (data) => ({
        url: BOOKING_URL,
        method: "POST",
        body: data,
      }),
    }),
    getAllBooking: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `${BOOKING_URL}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `${BOOKING_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    getBookingById: builder.query({
      query: (id) => ({
        url: `${BOOKING_URL}/${id}`,
        method: "GET",
      }),
    }),
    updateBooking: builder.mutation({
      query: ({ id, body }) => ({
        url: `${BOOKING_URL}/${id}`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetAllBookingQuery,
  useDeleteBookingMutation,
  useGetBookingByIdQuery,
  useUpdateBookingMutation,
} = bookingApi;
