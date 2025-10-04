import { Product_URL } from "@/store/constant";
import { apiSlice } from "../apiSlcie";

export const ProductApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProduct: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) =>
        `${Product_URL}?page=${page}&limit=${limit}&search=${search}`,
      providesTags: ["Channels"],
    }),

    getProductById: builder.query({
      query: (id: number) => `${Product_URL}/${id}`,
    }),

    // Create a new channel
    createProduct: builder.mutation({
      query: (data) => ({
        url: Product_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"], 
    }),

    // Update a channel
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `${Product_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    // Delete a channel
    deleteProduct: builder.mutation({
      query: (id: number) => ({
        url: `${Product_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for components
export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductQuery,
  useLazyGetProductByIdQuery,
} = ProductApi;
