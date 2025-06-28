import { apiSlice } from "./apiSlcie";
import { Auth_url } from "../constant";
const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //signup
    getme: builder.query({
      query: () => ({
        url: Auth_url,
        method: "GET",
        credentials: "include", 
      }),
    }),
    //login
    signIn: builder.mutation({
      query: (data) => ({
        url: `${Auth_url}/sign-in`,
        method: "POST",
        body: data,
        credentials: "include", 
      }),
    }),
    // all user
  }),
});

export const {useSignInMutation , useGetmeQuery} = authApi;
