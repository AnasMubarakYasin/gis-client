import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rolesApi = createApi({
  reducerPath: "rolesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/roles`,
  }),
  endpoints: (builder) => ({
    getById: builder.query({
      keepUnusedDataFor: 1,
      query: ({ id }) => ({ url: `${id}` }),
      transformResponse: (response, meta, arg) => response.data,
    }),
    getAll: builder.query({
      keepUnusedDataFor: 1,
      query: () => ({ url: "" }),
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
    undo: builder.mutation({
      query: ({ list }) => ({
        url: "",
        method: "PUT",
        body: list,
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

    removeById: builder.mutation({
      query: ({ id }) => ({
        url: id,
        method: "DELETE",
      }),
      transformResponse: (response, meta, arg) => response.data,
    }),
    removeManyById: builder.mutation({
      query: ({ ids }) => ({
        url: "",
        method: "DELETE",
        body: ids,
      }),
      transformResponse: (response, meta, arg) => response.data,
    }),
  }),
});

export const {
  useCreateMutation,
  useUndoMutation,

  useGetAllQuery,
  useGetByIdQuery,

  useUpdateByIdMutation,
  
  useRemoveByIdMutation,
  useRemoveManyByIdMutation,
} = rolesApi;
