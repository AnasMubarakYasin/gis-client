import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const supervisorsApi = createApi({
  reducerPath: "supervisorsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/v1/supervisors`,
  }),
  endpoints: (builder) => ({
    getAll: builder.query({
      keepUnusedDataFor: 1,
      query: ({ token }) => ({
        url: "",
        headers: { authorization: `Bearer ${token}` },
      }),
    }),
  }),
});

export const { useGetAllQuery } = supervisorsApi;
