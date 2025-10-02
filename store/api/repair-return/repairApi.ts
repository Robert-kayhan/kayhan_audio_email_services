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
    getAllRepairReport: builder.query({
      query: ({ page = 1, limit = 10, type, search }) => ({
        url: Repair_URl,
        method: "GET",
        params: { page, limit, type, search },
      }),
    }),

    getRepairReport: builder.query({
      query: (id) => ({
        url: `${Repair_URl}/${id}`,
        method: "GET",
      }),
    }),
    updateRepairReport: builder.mutation({
      query: ({ id, data }) => ({
        url: `${Repair_URl}/${id}`,
        body: data,
        method: "PUT",
      }),
    }),
     addNotes: builder.mutation({
      query: ({ id, data }) => ({
        url: `${Repair_URl}/note/${id}`,
        body: data,
        method: "POST",
      }),
    }),
    deleteRepairReport: builder.mutation({
      query: (data) => ({
        url: `${Repair_URl}/${data}`,
        method: "DELETE",
      }),
    }),
  }),
});
export const {
  useCreateRepairReportMutation,
  useGetAllRepairReportQuery,
  useUpdateRepairReportMutation,
  useGetRepairReportQuery,
  useDeleteRepairReportMutation,
  useAddNotesMutation
} = LeadApi;
