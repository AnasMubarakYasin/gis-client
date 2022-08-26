import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const membersApi = createApi({
  reducerPath: "membersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/v1/users`,
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
      async queryFn({ data, image, token }, queryApi, extraOptions, baseQuery) {
        const url_img = `/api/v1/resources/${data.role}s/pictures/${
          data.username
        }.${image.type.replace(/.*\//, "")}`;
        const res_img = await fetch(url_img, {
          method: "POST",
          // @ts-ignore
          headers: { authorization: `Bearer ${token}` },
          body: image,
        });
        if (!res_img.ok) {
          return {
            error: {
              error: res_img.statusText,
              status: res_img.status,
              data: "",
            },
          };
        }
        data.image = await res_img.json();
        const res = await baseQuery({
          url: "/signup",
          method: "POST",
          headers: { authorization: `Bearer ${token}` },
          body: data,
        });
        return res;
      },
    }),
    signin: builder.mutation({
      query: ({ data }) => ({
        url: "/signin",
        method: "POST",
        body: data,
      }),
    }),
    signout: builder.mutation({
      query: ({ token }) => ({
        url: "/signout",
        method: "GET",
        headers: { authorization: `Bearer ${token}` },
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
      async queryFn({ data, image, token }, queryApi, extraOptions, baseQuery) {
        if (image) {
          const url_img = `/api/v1/resources/${data.role}s/pictures/${
            data.username
          }.${image.type.replace(/.*\//, "")}`;
          const res_img = await fetch(url_img, {
            method: "POST",
            // @ts-ignore
            headers: { authorization: `Bearer ${token}` },
            body: image,
          });
          if (!res_img.ok) {
            return {
              error: {
                error: res_img.statusText,
                status: res_img.status,
                data: "",
              },
            };
          }
          data.image = await res_img.json();
        }
        const res = await baseQuery({
          url: ``,
          method: "PATCH",
          headers: { authorization: `Bearer ${token}` },
          body: data,
        });
        return res;
      },
    }),
    removeById: builder.mutation({
      query: ({ id, token }) => ({
        url: `/${id}`,
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      }),
    }),
    removeMany: builder.mutation({
      async queryFn({ data, token }, queryApi, extraOptions, baseQuery) {
        const res = await baseQuery({
          url: ``,
          method: "DELETE",
          headers: { authorization: `Bearer ${token}` },
          body: data,
        });
        return res;
      },
    }),
  }),
});

export const {
  useCreateMutation,
  useSigninMutation,
  useSignoutMutation,
  useUndoMutation,
  useAuthQuery,
  usePermissionMutation,

  useGetAllQuery,
  useRemoveManyMutation,

  useGetByIdQuery,
  useUpdateByIdMutation,
  useRemoveByIdMutation,
} = membersApi;
