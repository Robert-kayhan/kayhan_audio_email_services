import { apiSlice } from "./apiSlcie";
import { User_url } from "../constant";
const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //signup
    getme: builder.query({
      query: () => ({
        url: User_url,
        method: "GET",
        credentials: "include", 
      }),
    }),
    //login
    signIn: builder.mutation({
      query: (data) => ({
        url: `${User_url}/sign-in`,
        method: "POST",
        body: data,
        credentials: "include", 
      }),
    }),
    // all user
  }),
});

export const {useSignInMutation , useGetmeQuery} = userApi;
