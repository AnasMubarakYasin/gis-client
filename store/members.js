import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const membersApi = createApi({
  reducerPath: "membersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/v1/members`,
  }),
  endpoints: (builder) => ({
    getById: builder.query({
      keepUnusedDataFor: 1,
      query: ({ id, token }) => ({
        url: `/${id}`,
        headers: { authorization: `Bearer ${token}` },
      }),
    }),
    getAll: builder.query({
      keepUnusedDataFor: 1,
      query: ({ token }) => ({
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
    signin: builder.mutation({
      query: ({ data }) => ({
        url: "/signin",
        method: "POST",
        body: data,
      }),
    }),

    auth: builder.query({
      keepUnusedDataFor: 1,
      async queryFn({ token }, queryApi, extraOptions, baseQuery) {
        if (!token) {
          return {
            error: {
              error: "token not exists",
              status: "CUSTOM_ERROR",
              data: { message: "token not exists", code: 401 },
            },
          };
        }
        const res = await baseQuery({
          url: "/auth",
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });
        return res;
      },
    }),
    permission: builder.mutation({
      query: ({ access }) => ({
        url: "/permission",
        method: "POST",
        body: access,
      }),
    }),
    undo: builder.mutation({
      query: ({ list, token }) => ({
        url: "",
        method: "PUT",
        headers: { authorization: `Bearer ${token}` },
        body: list,
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
    removeById: builder.mutation({
      query: ({ id, token }) => ({
        url: `/${id}`,
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      }),
    }),
    removeMany: builder.mutation({
      query: ({ ids, token }) => ({
        url: "",
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
        body: ids,
      }),
    }),
  }),
});

export const {
  useCreateMutation,
  useSigninMutation,
  useUndoMutation,
  useAuthQuery,
  usePermissionMutation,

  useGetAllQuery,
  useRemoveManyMutation,

  useGetByIdQuery,
  useUpdateByIdMutation,
  useRemoveByIdMutation,
} = membersApi;
