import { apiSlice } from "./apiSlcie";
import { Lead_url } from "../constant";
const LeadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createLeadGroup: builder.mutation({
      query: (data) => ({
        url: Lead_url,
        method: "POST",
        body: data,
      }),
    }),
    getAllLeadGroup: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `${Lead_url}?page=${page}&limit=${limit}`,
        method: "GET",
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
