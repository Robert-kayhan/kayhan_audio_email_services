import { ORDER_URL } from "@/store/constant";
import { apiSlice } from "../apiSlcie";

export const OrderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrder: builder.query({
      query: ({ page = 1, limit = 1000, search = "" }) =>
        `${ORDER_URL}?page=${page}&limit=${limit}&search=${search}`,
      providesTags: ["Order"],
    }),

    getOrderById: builder.query({
      query: (id: number) => `${ORDER_URL}/${id}`,
    }),
    // Update a channel
    // updateDepartment: builder.mutation({
    //   query: ({ id, data }) => ({
    //     url: `${ORDER_URL}/${id}`,
    //     method: "PUT",
    //     body: data,
    //   }),
    //   invalidatesTags: ["Order"],
    // }),

    // Delete a channel
    deleteOrder: builder.mutation({
      query: (id: number) => ({
        url: `${ORDER_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrderByIdQuery,
  useGetOrderQuery,
  useDeleteOrderMutation,
} = OrderApi;
