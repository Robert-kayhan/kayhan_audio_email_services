// src/store/api/Inventory/UserMannulApi.ts
import { apiSlice } from "../apiSlcie";

export type UserManualPayload = {
  company_id: number;
  car_model_id: number;
  to_year:number;
  from_year:number;
  version_id?: number | null;

  title: string;
  slug?: string; // optional (backend can auto-generate)
  excerpt?: string;
  content: string;
  cover_image?: string;

  status?: number;
  created_by: number;
};

export type UserManualUpdatePayload = Partial<
  Omit<UserManualPayload, "created_by">
> & {
  edit_by?: number;
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
      invalidatesTags: ["UserManual"],
    }),

    // ✅ LIST (filters + pagination + search)
    getAllUserManuals: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: number;

        company_id?: number;
        car_model_id?: number;
        year?: number;
        version_id?: number;
      }
    >({
      query: (params) => ({
        url: "/api/user-manuals",
        method: "GET",
        params,
      }),
      providesTags: ["UserManual"],
    }),

    // ✅ GET BY SLUG (blog detail page)
    getUserManualBySlug: builder.query({
      query: (slug) => ({
        url: `/api/user-manuals/slug/${slug}`,
        method: "GET",
      }),
      providesTags: (_res, _err, slug) => [{ type: "UserManual", id: slug }],
    }),

    // ✅ UPDATE
    updateUserManual: builder.mutation({
      query: ({ id, data}) => ({
        url: `/api/user-manuals/${id}`,
        method: "PUT",
        body:data,
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: "UserManual", id: arg.id }],
    }),

    // ✅ DELETE
    deleteUserManual: builder.mutation<any, number>({
      query: (id) => ({
        url: `/api/user-manuals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserManual"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateUserManualMutation,
  useGetAllUserManualsQuery,
  useGetUserManualBySlugQuery,
  useUpdateUserManualMutation,
  useDeleteUserManualMutation,
} = UserMannul;