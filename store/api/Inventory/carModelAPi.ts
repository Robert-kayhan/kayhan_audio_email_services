import { CarModel_URL } from "@/store/constant";
import { apiSlice } from "../apiSlcie";
export const carModelApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all car models with pagination & search
  getCarModels: builder.query<
  any, // response type
  { page?: number; limit?: number; search?: string; company_id?: any; parent_id?: number }
>({
  query: ({ page = 1, limit = 10, search = "", company_id, parent_id }) => {
    let url = `${CarModel_URL}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;

    if (company_id !== undefined) url += `&company_id=${company_id}`;
    if (parent_id !== undefined) url += `&parent_id=${parent_id}`;

    return url;
  },
  providesTags: ["CarModels"],
}),


    // Get single car model by ID
    getCarModelById: builder.query<any, number>({
      query: (id) => `${CarModel_URL}/${id}`,
      providesTags: (_result, _error, id) => [{ type: "CarModels", id }],
    }),

    // Create a new car model
    createCarModel: builder.mutation<
      any,
      { name: string; description?: string }
    >({
      query: (data) => ({
        url: CarModel_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CarModels"],
    }),

    // Update a car model
    updateCarModel: builder.mutation<
      any,
      { id: number; data: Partial<{ name: string; description?: string }> }
    >({
      query: ({ id, data }) => ({
        url: `${CarModel_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "CarModels",
        { type: "CarModels", id },
      ],
    }),

    // Delete a car model
    deleteCarModel: builder.mutation<any, number>({
      query: (id) => ({
        url: `${CarModel_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        "CarModels",
        { type: "CarModels", id },
      ],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for components
export const {
  useGetCarModelsQuery,
  useGetCarModelByIdQuery,
  useCreateCarModelMutation,
  useUpdateCarModelMutation,
  useDeleteCarModelMutation,
} = carModelApi;
