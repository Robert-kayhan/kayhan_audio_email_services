import { apiSlice } from "./apiSlcie";
import { USER_url } from "../constant";
const UserApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSingleUser: builder.mutation({
      query: (data) => ({
        url: USER_url,
        body: data,
        method: "POST",
      }),
    }),
    createWholeUser: builder.query({
      query: () => ({
        url: `${USER_url}/create-user`,
        method: "POST",
      }),
    }),
    createMultipleUser: builder.mutation({
      query: (data) => ({
        url: `${USER_url}/upload-excel`,
        body: data,
        method: "POST",
      }),
    }),

    getAllUser: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        hasLeadOnly = false,
        role,
      }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search.trim()) {
          params.append("search", search);
        }

        if (hasLeadOnly) {
          params.append("hasLeadOnly", "true");
        }

        if (role) {
          params.append("role", role.toString());
        }

        return {
          url: `${USER_url}?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    getAllUserWithLead: builder.query({
      query: ({ page = 1, limit = 10, search = "", hasLeadOnly = false }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search) params.append("search", search);
        if (hasLeadOnly) params.append("hasLeadOnly", "true");

        return {
          url: `${USER_url}/lead-user?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `${USER_url}/user/${id}`,
        body: data,
        method: "PUT",
      }),
    }),

    deleteUser: builder.mutation({
      query: (data) => ({
        url: `${USER_url}/user/${data}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateSingleUserMutation,
  useCreateMultipleUserMutation,
  useGetAllUserQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetAllUserWithLeadQuery,
  useCreateWholeUserQuery
} = UserApi;
