import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const modelsApi = createApi({
  reducerPath: "modelsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/v1/models`,
  }),
  endpoints: (builder) => ({
    stats: builder.query({
      keepUnusedDataFor: 1,
      query: ({ token }) => ({
        url: "/stats",
        headers: { authorization: `Bearer ${token}` },
      }),
    }),
    system: builder.query({
      keepUnusedDataFor: 1,
      query: ({ token }) => ({
        url: "/system",
        headers: { authorization: `Bearer ${token}` },
      }),
    }),
    get: builder.query({
      keepUnusedDataFor: 1,
      query: ({ model, data, token }) => ({
        url: `/${model}`,
        headers: { authorization: `Bearer ${token}` },
      }),
    }),
    create: builder.mutation({
      query: ({ model, data, token }) => ({
        url: `/${model}`,
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: data,
      }),
    }),
    update: builder.mutation({
      query: ({ model, data, token }) => ({
        url: `/${model}`,
        method: "PATCH",
        headers: { authorization: `Bearer ${token}` },
        body: data,
      }),
    }),
    delete: builder.mutation({
      query: ({ model, data, token }) => ({
        url: `/${model}`,
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
  useStatsQuery,
  useSystemQuery,
  useGetQuery,
  useGetByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useUpdateByIdMutation,
  useDeleteByIdMutation,
} = modelsApi;
