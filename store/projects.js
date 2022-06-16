import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  // refetchOnReconnect: true,
  // refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/projects`,
  }),
  // tagTypes: ["All", "Name", "Patch/id"],
  endpoints: (builder) => ({
    getAll: builder.query({
      keepUnusedDataFor: 1,
      query: () => ({}),
      transformResponse: (response, meta, arg) => response.data,
      // providesTags: (result, error) => [{ type: "All" }],
    }),
    getByName: builder.query({
      keepUnusedDataFor: 1,
      query: (name) => ({ url: `name/${name}` }),
      transformResponse: (response, meta, arg) => response.data,
      // providesTags: (result, error, name) => [{ type: "Name", name }],
    }),
    getByNameWithTasks: builder.query({
      query: ({ name }) => ({ url: `name/${name}?with=tasks` }),
      keepUnusedDataFor: 1,
      transformResponse: (response, meta, arg) => response.data,
      // providesTags: (result, error, name) => [{ type: "Name", name }],
    }),
    create: builder.mutation({
      async queryFn({ data, file }, queryApi, extraOptions, baseQuery) {
        const res_img = await baseQuery({
          url: `image`,
          method: "POST",
          body: file,
        });
        data.image = res_img.data.data;
        const res = await baseQuery({
          method: "POST",
          body: data,
        });
        return res.data ? { data: res.data } : { error: res.error };
      },
      transformResponse: (response, meta, arg) => response.data,
      // invalidatesTags: ["Patch/id"],
    }),
    updateById: builder.mutation({
      async queryFn({ id, data, file }, queryApi, extraOptions, baseQuery) {
        if (file) {
          const res_img = await baseQuery({
            url: `image`,
            method: "POST",
            body: file,
          });
          data.image = res_img.data.data;
        }
        const res = await baseQuery({
          url: id,
          method: "PATCH",
          body: data,
        });
        return res.data ? { data: res.data } : { error: res.error };
      },
      transformResponse: (response, meta, arg) => response.data,
      // invalidatesTags: ["Patch/id"],
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
  useGetAllQuery,
  useGetByNameQuery,
  useGetByNameWithTasksQuery,
  useCreateMutation,
  useUpdateByIdMutation,
  useDeleteByIdMutation,
} = projectsApi;
