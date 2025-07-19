import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
// import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  // baseUrl: "https://staging.cravebuy.com/",
  baseUrl: process.env.NEXT_PUBLIC_ADDRESS,
  credentials: "include",
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User"],
  endpoints: () => ({}),
});
