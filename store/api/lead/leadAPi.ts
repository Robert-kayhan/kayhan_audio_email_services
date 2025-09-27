import { apiSlice } from "../apiSlcie";
import { Lead_url } from "../../constant";
const LeadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createLeadGroup: builder.mutation({
      query: (data) => ({
        url: Lead_url,
        method: "POST",
        body: data,
      }),
    }),
    getAllLeadGroup: builder.query<
      any,
      { page?: number; limit?: number; type?: "Retail" | "wholeSale" }
    >({
      query: ({ page = 1, limit = 10, type } = {}) => ({
        url: Lead_url,
        method: "GET",
        params: { page, limit, type }, // send as query params
      }),
    }),

    getLeadGroup: builder.query({
      query: ({ id }) => ({
        url: `${Lead_url}/${id}`,
        method: "GET",
      }),
    }),
    updateLeadGroup: builder.mutation({
      query: ({ id, data }) => ({
        url: `${Lead_url}/${id}`,
        body: data,
        method: "PUT",
      }),
    }),
    deleteLeadGroup: builder.mutation({
      query: (data) => ({
        url: `${Lead_url}/${data}`,
        method: "DELETE",
      }),
    }),
  }),
});
export const {
  useCreateLeadGroupMutation,
  useGetAllLeadGroupQuery,
  useUpdateLeadGroupMutation,
  useGetLeadGroupQuery,
  useDeleteLeadGroupMutation,
} = LeadApi;
