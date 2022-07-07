import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/v1/tasks`,
  }),
  endpoints: (builder) => ({
    getById: builder.query({
      keepUnusedDataFor: 1,
      query: ({ id, token }) => ({
        url: `/${id}`,
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
    update: builder.mutation({
      query: ({ data, token }) => ({
        url: "",
        method: "PATCH",
        headers: { authorization: `Bearer ${token}` },
        body: data,
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
  useGetByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  useUpdateByIdMutation,
} = tasksApi;
