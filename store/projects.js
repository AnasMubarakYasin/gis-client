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
    getAllPublic: builder.query({
      keepUnusedDataFor: 0,
      query: () => ({
        url: "/public",
      }),
      // providesTags: (result, error) => [{ type: "All" }],
    }),
    getByName: builder.query({
      keepUnusedDataFor: 0,
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
          url: `name/${name}`,
          headers: { authorization: `Bearer ${token}` },
        });
        return res.data ? { data: res.data } : { error: res.error };
      },
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
      async queryFn(
        { data, image, proposal, token },
        queryApi,
        extraOptions,
        baseQuery
      ) {
        const res_img = await fetch(
          `/api/v1/resources/projects/pictures/${
            data.name
          }.${image.type.replace(/.*\//, "")}`,
          {
            method: "POST",
            headers: { authorization: `Bearer ${token}` },
            body: image,
          }
        );
        const res_doc = await fetch(
          `/api/v1/resources/projects/documents/${
            data.name
          }.${image.type.replace(/.*\//, "")}`,
          {
            method: "POST",
            headers: { authorization: `Bearer ${token}` },
            body: proposal,
          }
        );
        if (!res_img.ok) {
          return {
            error: {
              error: res_img.statusText,
              status: "CUSTOM_ERROR",
              data: { message: await res_img.json(), code: res_img.status },
            },
          };
        }
        if (!res_doc.ok) {
          return {
            error: {
              error: res_doc.statusText,
              status: "CUSTOM_ERROR",
              data: { message: await res_doc.json(), code: res_doc.status },
            },
          };
        }
        data.image = await res_img.json();
        data.proposal = await res_doc.json();
        const res = await baseQuery({
          url: "/create",
          method: "POST",
          headers: { authorization: `Bearer ${token}` },
          body: data,
        });
        return res.data ? { data: res.data } : { error: res.error };
      },
      // invalidatesTags: ["Patch/id"],
    }),
    getById: builder.query({
      keepUnusedDataFor: 0,
      async queryFn(
        { id, includes = [], token },
        queryApi,
        extraOptions,
        baseQuery
      ) {
        if (!id) {
          return {
            error: {
              error: "id project not exist",
              status: "CUSTOM_ERROR",
              data: { message: "id project not exist", code: 404 },
            },
          };
        }
        const res = baseQuery({
          url: `/${id}?${includes.map((rel) => "includes=" + rel).join("&")}`,
          headers: { authorization: `Bearer ${token}` },
        });
        return res;
      },
    }),
    updateById: builder.mutation({
      async queryFn(
        { id, data, image, proposal, token },
        queryApi,
        extraOptions,
        baseQuery
      ) {
        if (image) {
          const res_img = await fetch(
            `/api/v1/resources/projects/pictures/${
              data.name
            }.${image.type.replace(/.*\//, "")}`,
            {
              method: "POST",
              headers: { authorization: `Bearer ${token}` },
              body: image,
            }
          );
          if (!res_img.ok) {
            return {
              error: {
                error: res_img.statusText,
                status: "CUSTOM_ERROR",
                data: { message: await res_img.json(), code: res_img.status },
              },
            };
          }
          data.image = await res_img.json();
        }
        if (proposal) {
          const res_doc = await fetch(
            `/api/v1/resources/projects/documents/${
              data.name
            }.${image.type.replace(/.*\//, "")}`,
            {
              method: "POST",
              headers: { authorization: `Bearer ${token}` },
              body: proposal,
            }
          );
          if (!res_doc.ok) {
            return {
              error: {
                error: res_doc.statusText,
                status: "CUSTOM_ERROR",
                data: { message: await res_doc.json(), code: res_doc.status },
              },
            };
          }
          data.proposal = await res_doc.json();
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
  useGetAllPublicQuery,
  useGetAllQuery,
  useGetByNameQuery,
  useGetByNameWithTasksQuery,
  useCreateMutation,
  useGetByIdQuery,
  useUpdateByIdMutation,
  useDeleteByIdMutation,
} = projectsApi;
