import { apiSlice } from "../apiSlcie";

export const leadFollowApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeadFollowUp: builder.query({
  query: ({
    page = 1,
    limit = 10,
    leadStatus,
    search, // add search parameter
  }: {
    page?: number;
    limit?: number;
    leadStatus?: string;
    search?: string;
  }) => {
    let queryStr = `/api/lead-follow-up?page=${page}&limit=${limit}`;

    if (leadStatus) {
      queryStr += `&leadStatus=${encodeURIComponent(leadStatus)}`;
    }

    if (search) {
      queryStr += `&search=${encodeURIComponent(search)}`; // append search query
    }

    return {
      url: queryStr,
      method: "GET",
    };
  },
}),


    getLeadById: builder.query<any, string>({
      query: (id) => `/api/lead-follow-up/${id}`,
    }),
    createLead: builder.mutation<any, any>({
      query: (newLead) => ({
        url: "/api/lead-follow-up/",
        method: "POST",
        body: newLead,
      }),
    }),
    updateLead: builder.mutation<any, { id: any; data: any }>({
      query: ({ id, data }) => ({
        url: `/api/lead-follow-up/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteLead: builder.mutation<any, string>({
      query: (id) => ({
        url: `/leads/${id}`,
        method: "DELETE",
      }),
    }),
    updateFollowUpStage: builder.mutation<
      any,
      { id: string; stage: string; data: any }
    >({
      query: ({ id, stage, data }) => ({
        url: `/api/lead-follow-up/${id}/follow-up/${stage}`,
        method: "PUT",
        body: data,
      }),
    }),
    updateSaleStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/lead-follow-up/update-sale-status/${id}`,
        body: data,
        method: "PUT",
      }),
    }),
    getNotes: builder.query({
      query: (data) => ({
        url: `/api/lead-follow-up/notes/${data}`,
      }),
    }),
     checkEmailExists: builder.query({
      query: (data) => ({
        url: `/api/lead-follow-up/check-email/${data}`,
      }),
    }),
    addNotes: builder.mutation({
      query: (data ) => ({
        url: `/api/lead-follow-up/notes/${data.id}`,
        body: data,
        method: "POST",
      }),
    }),
  }),

  // overrideExisting: false,
});

export const {
  useGetAllLeadFollowUpQuery,
  useGetLeadByIdQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useUpdateFollowUpStageMutation,
  useUpdateSaleStatusMutation,
  useGetNotesQuery,
  useAddNotesMutation,
  useCheckEmailExistsQuery
} = leadFollowApi;
