import { Company_URL } from "@/store/constant";
import { apiSlice } from "../apiSlcie";

export const DepartmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getcompany: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) =>
        `${Company_URL}?page=${page}&limit=${limit}&search=${search}`,
      providesTags: ["Channels"],
    }),

    getcompanyById: builder.query({
      query: (id: number) => `${Company_URL}/${id}`,
    }),

    // Create a new channel
    createcompany: builder.mutation({
      query: (data: { name: string; description: string }) => ({
        url: Company_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Department"],
    }),

    // Update a channel
    updatecompany: builder.mutation({
      query: ({ id, data }) => ({
        url: `${Company_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Department"],
    }),

    // Delete a channel
    deletecompany: builder.mutation({
      query: (id: number) => ({
        url: `${Company_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Department"],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for components
export const {
  useCreatecompanyMutation,
  useDeletecompanyMutation,
  useUpdatecompanyMutation,
  useGetcompanyByIdQuery,
  useGetcompanyQuery,
} = DepartmentApi;
