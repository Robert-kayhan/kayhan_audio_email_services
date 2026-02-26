// src/store/api/versionApi.ts
import { apiSlice } from "../apiSlcie";

export const VirsonAPi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ CREATE
    createVersion: builder.mutation<
      any,
      { name: string; description?: string; status?: number; created_by: number }
    >({
      query: (body) => ({
        url: "/api/versions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Version"],
    }),

    // ✅ LIST (pagination + search + status)
    getAllVersions: builder.query<
      any,
      { page?: number; limit?: number; search?: string; status?: number }
    >({
      query: (params) => ({
        url: "/api/versions",
        method: "GET",
        params,
      }),
      providesTags: ["Version"],
    }),

    // ✅ GET ONE
    getVersionById: builder.query<any, number>({
      query: (id) => ({
        url: `/api/versions/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Version", id }],
    }),

    // ✅ UPDATE
    updateVersion: builder.mutation<
      any,
      { id: number; body: { name?: string; description?: string; status?: number; edit_by?: number } }
    >({
      query: ({ id, body }) => ({
        url: `/api/versions/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: "Version", id: arg.id }],
    }),

    // ✅ DELETE
    deleteVersion: builder.mutation<any, number>({
      query: (id) => ({
        url: `/api/versions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Version"],
    }),
  }),

  overrideExisting: false,
});

// ✅ Hooks
export const {
  useCreateVersionMutation,
  useGetAllVersionsQuery,
  useGetVersionByIdQuery,
  useUpdateVersionMutation,
  useDeleteVersionMutation,
} = VirsonAPi;