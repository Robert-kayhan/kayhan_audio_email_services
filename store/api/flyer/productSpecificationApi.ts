// src/services/productSpecificationApi.ts
import { apiSlice } from "../apiSlcie"; // adjust to your path
import { PRODUCT_SPECIFICATIONS_URL } from "../../constant"; // e.g. "/api/product-specifications"

// Types
export interface ProductSpecification {
  id?: number;
  name?: string;
  processor?: string;
  operatingSystem?: string;
  memory?: string;
  wirelessCarPlayAndroidAuto?: string;
  audioVideoOutput?: string;
  amplifier?: string;
  cameraInputs?: string;
  microphone?: string;
  bluetooth?: string;
  usbPorts?: string;
  steeringWheelACControls?: string;
  factoryReversingCamera?: string;
  audioVideoFeatures?: string;
  radioTuner?: string;
  googlePlayStore?: string;
  netflix?: string;
  disneyPlus?: string;
  foxtel?: string;
  apps?: string;
  screenSize?: string;
  screenResolution?: string;
  onlineVideos?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface GetAllProductSpecificationsResponse {
  data: ProductSpecification[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    perPage: number;
  };
}

type PaginationParams = {
  page?: number;
  limit?: number;
};

export const productSpecificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create
    createProductSpecification: builder.mutation<ProductSpecification, Partial<ProductSpecification>>({
      query: (data) => ({
        url: PRODUCT_SPECIFICATIONS_URL,
        method: "POST",
        body: data,
      }),
    }),

    // Get All with pagination
    getAllProductSpecifications: builder.query<GetAllProductSpecificationsResponse, PaginationParams>({
      query: ({ page = 1, limit = 10 }) => ({
        url: PRODUCT_SPECIFICATIONS_URL,
        method: "GET",
        params: { page, limit },
      }),
    }),

    // Get One by ID
    getProductSpecificationById: builder.query<ProductSpecification, number>({
      query: (id) => ({
        url: `${PRODUCT_SPECIFICATIONS_URL}/${id}`,
        method: "GET",
      }),
    }),

    // Update
    updateProductSpecification: builder.mutation<ProductSpecification, { id: number } & Partial<ProductSpecification>>({
      query: ({ id, ...data }) => ({
        url: `${PRODUCT_SPECIFICATIONS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    // Delete
    deleteProductSpecification: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `${PRODUCT_SPECIFICATIONS_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateProductSpecificationMutation,
  useGetAllProductSpecificationsQuery,
  useGetProductSpecificationByIdQuery,
  useUpdateProductSpecificationMutation,
  useDeleteProductSpecificationMutation,
} = productSpecificationApi;
