import { Department_URL } from "@/store/constant";
import { apiSlice } from "../apiSlcie";

export const DepartmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDepartment: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) =>
        `${Department_URL}?page=${page}&limit=${limit}&search=${search}`,
      providesTags: ["Channels"],
    }),

    getDepartmentById: builder.query({
      query: (id: number) => `${Department_URL}/${id}`,
    }),

    // Create a new channel
    createDepartment: builder.mutation({
      query: (data: { name: string; description: string }) => ({
        url: Department_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Department"],
    }),

    // Update a channel
    updateDepartment: builder.mutation({
      query: ({ id, data }) => ({
        url: `${Department_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Department"],
    }),

    // Delete a channel
    deleteDepartment: builder.mutation({
      query: (id: number) => ({
        url: `${Department_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Department"],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for components
export const {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentQuery,
  useLazyGetDepartmentByIdQuery,
} = DepartmentApi;
