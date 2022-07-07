import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  // refetchOnReconnect: true,
  // refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/v1/projects`,
  }),
  // tagTypes: ["All", "Name", "Patch/id"],
  endpoints: (builder) => ({
    getAll: builder.query({
      keepUnusedDataFor: 0,
      query: ({ token }) => ({
        url: "",
        headers: { authorization: `Bearer ${token}` },
      }),
      // providesTags: (result, error) => [{ type: "All" }],
    }),
    getByName: builder.query({
      keepUnusedDataFor: 0,
      query: ({ name, token }) => ({
        url: `name/${name}`,
        headers: { authorization: `Bearer ${token}` },
      }),
      // providesTags: (result, error, name) => [{ type: "Name", name }],
    }),
    getByNameWithTasks: builder.query({
      async queryFn({ name, token }, queryApi, extraOptions, baseQuery) {
        if (!name) {
          return {
            error: {
              error: "project not found",
              status: "CUSTOM_ERROR",
              data: { message: "project not found", code: 401 },
            },
          };
        }
        const res = await baseQuery({
          url: `name/${name}?with=tasks`,
          headers: { authorization: `Bearer ${token}` },
        });
        return res.data ? { data: res.data } : { error: res.error };
      },
      // query: ({ name, token }) => ({
      //   url: `name/${name}?with=tasks`,
      //   headers: { authorization: `Bearer ${token}` },
      // }),
      keepUnusedDataFor: 0,
      // providesTags: (result, error, name) => [{ type: "Name", name }],
    }),
    create: builder.mutation({
      async queryFn({ data, file, token }, queryApi, extraOptions, baseQuery) {
        const res_img = await baseQuery({
          url: `image`,
          method: "POST",
          headers: { authorization: `Bearer ${token}` },
          body: file,
        });
        if (res_img.error) {
          return { error: res_img.error };
        }
        data.image = res_img.data;
        const res = await baseQuery({
          url: "",
          method: "POST",
          headers: { authorization: `Bearer ${token}` },
          body: data,
        });
        return res.data ? { data: res.data } : { error: res.error };
      },
      // invalidatesTags: ["Patch/id"],
    }),
    updateById: builder.mutation({
      async queryFn(
        { id, data, file, token },
        queryApi,
        extraOptions,
        baseQuery
      ) {
        if (file) {
          const res_img = await baseQuery({
            url: `image`,
            method: "POST",
            headers: { authorization: `Bearer ${token}` },
            body: file,
          });
          if (res_img.error) {
            return { error: res_img.error };
          }
          data.image = res_img.data;
        }
        const res = await baseQuery({
          url: `/${id}`,
          method: "PATCH",
          headers: { authorization: `Bearer ${token}` },
          body: data,
        });
        return res.data ? { data: res.data } : { error: res.error };
      },
      // invalidatesTags: ["Patch/id"],
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
  useGetAllQuery,
  useGetByNameQuery,
  useGetByNameWithTasksQuery,
  useCreateMutation,
  useUpdateByIdMutation,
  useDeleteByIdMutation,
} = projectsApi;
