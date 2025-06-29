import { apiSlice } from "./apiSlcie";
import { TEMPLATE_url } from "../constant";

// Types
interface Template {
  id: string;
  name: string;
  design: Record<string, any>;
}

interface GetAllTemplatesResponse {
  data: Template[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    perPage: number;
  };
}

// ✅ Define PaginationParams
type PaginationParams = {
  page?: number;
  limit?: number;
};

export const templateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create Template
    createTemplate: builder.mutation({
      query: (data) => ({
        url: TEMPLATE_url,
        method: "POST",
        body: data,
      }),
    }),

    // Get All Templates with pagination
    getAllTemplates: builder.query<GetAllTemplatesResponse, PaginationParams>({
      query: ({ page = 1, limit = 10 }) => ({
        url: TEMPLATE_url,
        method: "GET",
        params: { page, limit },
      }),
    }),

    // Get One Template
    getTemplateById: builder.query({
      query: (id) => ({
        url: `${TEMPLATE_url}/${id}`,
        method: "GET",
      }),
    }),

    // Update Template
    updateTemplate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${TEMPLATE_url}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    // Delete Template
    deleteTemplate: builder.mutation({
      query: (id) => ({
        url: `${TEMPLATE_url}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateTemplateMutation,
  useGetAllTemplatesQuery,
  useGetTemplateByIdQuery,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
} = templateApi;
