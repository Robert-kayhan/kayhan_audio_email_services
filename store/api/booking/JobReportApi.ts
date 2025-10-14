import { apiSlice } from "../apiSlcie";
import { JOBREPORT_URL } from "@/store/constant";
export const JobReportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create Job Report
    createJob: builder.mutation({
      query: (data) => ({
        url: JOBREPORT_URL,
        method: "POST",
        body: data,
      }),
    }),
    updateJob: builder.mutation({
      query: ({ id, data }) => ({
        url: `${JOBREPORT_URL}/job-report/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    // ✅ Cancel Job
    cancelJob: builder.mutation({
      query: ({ id, cancelReason }) => ({
        url: `${JOBREPORT_URL}/cancel/${id}`,
        method: "PUT",
        body: { cancelReason },
      }),
    }),
    getJobByBookingId: builder.query({
      query: (bookingId) => `${JOBREPORT_URL}/${bookingId}`,
    }),

    // ✅ Reschedule Job
    rescheduleJob: builder.mutation({
      query: ({ id, rescheduleTime }) => ({
        url: `${JOBREPORT_URL}/${id}`,
        method: "PUT",
        body: { rescheduleTime },
      }),
    }),
    timeApi: builder.mutation({
      query: ({ id, data }) => ({
        url: `${JOBREPORT_URL}/${id}/times`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateJobMutation,
  useCancelJobMutation,
  useRescheduleJobMutation,
  useGetJobByBookingIdQuery,
  useUpdateJobMutation,
  useTimeApiMutation
} = JobReportApi;
