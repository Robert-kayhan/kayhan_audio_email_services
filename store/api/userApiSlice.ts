import { apiSlice } from "./apiSlcie";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //signup
    signUp: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
    //login
    signIn: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
    // all user
  }),
});

export const {useSignInMutation , useSignUpMutation} = userApi;
