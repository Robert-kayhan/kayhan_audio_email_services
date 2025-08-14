// src/store/api/DashBoardApi.js
import { apiSlice } from "./apiSlcie";
export const DashBoardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: (params) => ({
        url: "/api/dashboard",
        method: "GET",
        params, // e.g., { startDate, endDate, platform }
      }),
    //   providesTags: ["Dashboard"],
    }),
    getRecentOrders: builder.query({
      query: (params) => ({
        url: "/dashboard/recent-orders",
        method: "GET",
        params,
      }),
    //   providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetRecentOrdersQuery } =
  DashBoardApi;
