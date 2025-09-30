import { apiSlice } from "../apiSlcie";
import { Repair_URl } from "../../constant";
const LeadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRepairReport: builder.mutation({
      query: (data) => ({
        url: Repair_URl,
        method: "POST",
        body: data,
      }),
    }),
    getAllLeadGroup: builder.query<
      any,
      { page?: number; limit?: number; type?: "Retail" | "wholeSale" }
    >({
      query: ({ page = 1, limit = 10, type } = {}) => ({
        url: Repair_URl,
        method: "GET",
        params: { page, limit, type }, 
      }),
    }),

    getLeadGroup: builder.query({
      query: ({ id }) => ({
        url: `${Repair_URl}/${id}`,
        method: "GET",
      }),
    }),
    updateLeadGroup: builder.mutation({
      query: ({ id, data }) => ({
        url: `${Repair_URl}/${id}`,
        body: data,
        method: "PUT",
      }),
    }),
    deleteLeadGroup: builder.mutation({
      query: (data) => ({
        url: `${Repair_URl}/${data}`,
        method: "DELETE",
      }),
    }),
  }),
});
export const {
  useCreateRepairReportMutation,
  useGetAllLeadGroupQuery,
  useUpdateLeadGroupMutation,
  useGetLeadGroupQuery,
  useDeleteLeadGroupMutation,
} = LeadApi;
