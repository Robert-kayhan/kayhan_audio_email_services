import { apiSlice } from "../apiSlcie";

export const manualTypesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL
    getManualTypes: builder.query<any, { page?: number; search?: string }>({
      query: ({ page = 1, search = "" }) =>
        `/api/user-manualtypes?page=${page}&search=${search}`,
      providesTags: ["ManualTypes"],
    }),

    // ✅ GET SINGLE
    getManualTypeById: builder.query<any, number>({
      query: (id) => `/api/user-manualtypes/${id}`,
    }),

    // ✅ CREATE
    createManualType: builder.mutation({
      query: (body) => ({
        url: `/api/user-manualtypes`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["ManualTypes"],
    }),

    // ✅ UPDATE
    updateManualType: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/user-manualtypes/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["ManualTypes"],
    }),

    // ✅ DELETE
    deleteManualType: builder.mutation({
      query: (id) => ({
        url: `/api/user-manualtypes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ManualTypes"],
    }),
  }),
});

export const {
  useGetManualTypesQuery,
  useGetManualTypeByIdQuery,
  useCreateManualTypeMutation,
  useUpdateManualTypeMutation,
  useDeleteManualTypeMutation,
} = manualTypesApi;