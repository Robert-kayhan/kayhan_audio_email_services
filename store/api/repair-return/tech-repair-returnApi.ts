import { apiSlice } from "../apiSlcie";
import { Tech_repair } from "../../constant";
const TechRepairReturn = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTechRepair: builder.mutation({
      query: (data) => ({
        url: Tech_repair,
        method: "POST",
        body: data,
      }),
    }),
    getAllTechRepair: builder.query({
      query: ({ page = 1, limit = 10, search = "", status = "all" }) => ({
        url: Tech_repair,
        method: "GET",
        params: { page, limit, search, status },
      }),
    }),

    getTechRepair: builder.query({
      query: (id) => ({
        url: `${Tech_repair}/${id}`,
        method: "GET",
      }),
    }),
    updateTechReport: builder.mutation({
      query: ({ id, data }) => ({
        url: `${Tech_repair}/${id}`,
        method: "PUT",
        body: data, // <-- send the updated fields here
      }),
    }),
    deleteTechReport: builder.mutation({
      query: (id) => ({
        url: `${Tech_repair}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});
export const {
  useCreateTechRepairMutation,
  useGetAllTechRepairQuery,
  useGetTechRepairQuery,
  useUpdateTechReportMutation,
  useDeleteTechReportMutation
} = TechRepairReturn;
