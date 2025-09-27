import { Channel_URL } from "@/store/constant";
import { apiSlice } from "../apiSlcie";

export const channelApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all channels with pagination & search
    getChannels: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) =>
        `${Channel_URL}?page=${page}&limit=${limit}&search=${search}`,
      providesTags: ["Channels"],
    }),

    // Get single channel by ID
    getChannelById: builder.query({
      query: (id: number) => `${Channel_URL}/${id}`,
    }),

    // Create a new channel
    createChannel: builder.mutation({
      query: (data: { name: string; description: string }) => ({
        url: Channel_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Channels"],
    }),

    // Update a channel
    updateChannel: builder.mutation({
      query: ({ id, data }) => ({
        url: `${Channel_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Channels"],
    }),

    // Delete a channel
    deleteChannel: builder.mutation({
      query: (id: number) => ({
        url: `${Channel_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Channels"],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for components
export const {
  useGetChannelsQuery,
  useGetChannelByIdQuery,
  useCreateChannelMutation,
  useUpdateChannelMutation,
  useDeleteChannelMutation,
} = channelApi;
