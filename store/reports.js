import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/v1/reports`,
  }),
  endpoints: (builder) => ({
    get: builder.query({
      keepUnusedDataFor: 1,
      query: ({ data, token }) => ({
        url: "",
        headers: { authorization: `Bearer ${token}` },
      }),
    }),
    create: builder.mutation({
      query: ({ data, token }) => ({
        url: "",
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: data,
      }),
    }),
    delete: builder.mutation({
      query: ({ data, token }) => ({
        url: "",
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
        body: data,
      }),
    }),
    getById: builder.query({
      keepUnusedDataFor: 1,
      query: ({ id, token }) => ({
        url: `/${id}`,
        headers: { authorization: `Bearer ${token}` },
      }),
    }),
    updateById: builder.mutation({
      query: ({ id, data, token }) => ({
        url: `/${id}`,
        method: "PATCH",
        headers: { authorization: `Bearer ${token}` },
        body: data,
      }),
    }),
    deleteById: builder.mutation({
      query: ({ id, token }) => ({
        url: `/${id}`,
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      }),
    }),
  }),
});

export const {
  useGetQuery,
  useGetByIdQuery,
  useCreateMutation,
  useDeleteMutation,
  useUpdateByIdMutation,
  useDeleteByIdMutation,
} = reportsApi;
