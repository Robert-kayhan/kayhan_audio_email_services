// src/services/flyerApi.ts
import { apiSlice } from "../apiSlcie"; // Adjust path accordingly
import { FLYERS_URL } from "../../constant"; // e.g. "/api/flyers"

// Types
export interface Flyer {
  id?: number;
  title: string;
  description?: string;
  productOneImageUrl?: string;
  productTwoImageUrl?: string;
  productSpecificationIdOne?: number;
  productSpecificationIdTwo?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface GetAllFlyersResponse {
  data: Flyer[];
  meta?: {
    totalItems?: number;
    currentPage?: number;
    totalPages?: number;
    perPage?: number;
  };
}

type PaginationParams = {
  page?: number;
  limit?: number;
};

export const flyerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create
    createFlyer: builder.mutation<Flyer, Partial<Flyer>>({
      query: (data) => ({
        url: FLYERS_URL,
        method: "POST",
        body: data,
      }),
    }),
    createSingleFlyer: builder.mutation<Flyer, Partial<Flyer>>({
      query: (data) => ({
        url: `${FLYERS_URL}/create-single`,
        method: "POST",
        body: data,
      }),
    }),
    sendFlyer: builder.mutation({
      query: (data) => ({
        url: `${FLYERS_URL}/send-flyer`,
        method: "POST",
        body: data,
      }),
    }),
    // Get all with optional pagination (if backend supports it)
    getAllFlyers: builder.query<GetAllFlyersResponse, any>({
      query: ({ page = 1, limit = 10, search } = {}) => ({
        url: FLYERS_URL,
        method: "GET",
        params: {
          page,
          limit,
          ...(search ? { search } : {}), // only send search if provided
        },
      }),
    }),

    // Get by ID
    getFlyerById: builder.query<Flyer, number>({
      query: (id) => ({
        url: `${FLYERS_URL}/${id}`,
        method: "GET",
      }),
    }),

    // Update
    updateFlyer: builder.mutation<Flyer, { id: number } & Partial<Flyer>>({
      query: ({ id, ...data }) => ({
        url: `${FLYERS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    // Delete
    deleteFlyer: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `${FLYERS_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateFlyerMutation,
  useCreateSingleFlyerMutation,
  useGetAllFlyersQuery,
  useGetFlyerByIdQuery,
  useUpdateFlyerMutation,
  useDeleteFlyerMutation,
  useSendFlyerMutation
} = flyerApi;
