// src/store/api/Inventory/UserMannulApi.ts
import { apiSlice } from "../apiSlcie";

export type UserManualPayload = {
  company_id: number;

  // ✅ match backend model
  model_id: number;
  sub_model_id?: number | null;

  manual_type_id?: number | null;

  to_year: number;
  from_year: number;
  version_id?: number | null;

  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  cover_image?: string;

  status?: number;
  created_by: number;
};

export type UserManualUpdatePayload = Partial<Omit<UserManualPayload, "created_by">> & {
  edit_by?: number;
};

// ✅ list filters (same as manual tree)
export type ManualListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;

  company_id?: number;
  model_id?: number;
  sub_model_id?: number;
  manual_type_id?: number;

  // optional
  version_id?: number;

  // if your backend supports this (optional)
  year?: number;
};

// ✅ Years API query params
export type ManualYearsParams = {
  company_id?: number;
  model_id: number; // ✅ required
  sub_model_id?: number;
  manual_type_id?: number;
  version_id?: number;
};

export type ManualYearsResponse = {
  minYear: number | null;
  maxYear: number | null;
  years: number[];
  message?: string;
};

export const UserMannul = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ CREATE
    createUserManual: builder.mutation<any, UserManualPayload>({
      query: (body) => ({
        url: "/api/user-manuals",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "UserManual", id: "LIST" }],
    }),

    // ✅ LIST
    getAllUserManuals: builder.query<any, ManualListParams>({
      query: (params) => ({
        url: "/api/user-manuals",
        method: "GET",
        params: {
          ...params,
          search: params?.search ? encodeURIComponent(params.search) : "",
        },
      }),
      providesTags: (result) =>
        result?.data?.length
          ? [
              { type: "UserManual" as const, id: "LIST" },
              ...result.data.map((m: any) => ({
                type: "UserManual" as const,
                id: m.id,
              })),
            ]
          : [{ type: "UserManual" as const, id: "LIST" }],
    }),

    // ✅ GET YEARS (NEW)
    getManualYears: builder.query<ManualYearsResponse, ManualYearsParams>({
      query: (params) => ({
        url: "/api/user-manuals/years",
        method: "GET",
        params,
      }),

    }),

    // ✅ GET BY SLUG
    getUserManualBySlug: builder.query<any, string>({
      query: (slug) => ({
        url: `/api/user-manuals/slug/${slug}`,
        method: "GET",
      }),
      providesTags: (_res, _err, slug) => [{ type: "UserManual", id: slug }],
    }),

    // ✅ UPDATE
    updateUserManual: builder.mutation<any, { id: number; data: UserManualUpdatePayload }>({
      query: ({ id, data }) => ({
        url: `/api/user-manuals/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "UserManual", id: arg.id },
        { type: "UserManual", id: "LIST" },
      ],
    }),

    // ✅ DELETE
    deleteUserManual: builder.mutation<any, number>({
      query: (id) => ({
        url: `/api/user-manuals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "UserManual", id },
        { type: "UserManual", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateUserManualMutation,
  useGetAllUserManualsQuery,
  useGetManualYearsQuery, // ✅ NEW HOOK
  useGetUserManualBySlugQuery,
  useUpdateUserManualMutation,
  useDeleteUserManualMutation,
} = UserMannul;