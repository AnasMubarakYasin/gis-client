import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/tasks`,
  }),
  endpoints: (builder) => ({
    getById: builder.query({
      keepUnusedDataFor: 1,
      query: ({ id }) => ({ url: `${id}` }),
      transformResponse: (response, meta, arg) => response.data,
    }),
    create: builder.mutation({
      query: ({ data }) => ({
        url: "",
        method: "POST",
        body: data,
      }),
      transformResponse: (response, meta, arg) => response.data,
    }),
    updateById: builder.mutation({
      query: ({ id, data }) => ({
        url: id,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response, meta, arg) => response.data,
    }),
    deleteById: builder.mutation({
      query: ({ id }) => ({
        url: id,
        method: "DELETE",
      }),
      transformResponse: (response, meta, arg) => response.data,
    }),
  }),
});

export const {
  useGetByIdQuery,
  useCreateMutation,
  useUpdateByIdMutation
} = tasksApi;
