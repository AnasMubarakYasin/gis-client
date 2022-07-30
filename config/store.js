import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import user from "@/store/user";
import { projectsApi } from "@/store/projects";
import { reportsApi } from "@/store/reports";
import { membersApi } from "@/store/members";
import { modelsApi } from "@/store/models";
import { rolesApi } from "@/store/roles";
import { supervisorsApi } from "@/store/supervisors";

const store = configureStore({
  reducer: {
    user,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [membersApi.reducerPath]: membersApi.reducer,
    [modelsApi.reducerPath]: modelsApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [supervisorsApi.reducerPath]: supervisorsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      projectsApi.middleware,
      reportsApi.middleware,
      membersApi.middleware,
      modelsApi.middleware,
      rolesApi.middleware,
      supervisorsApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
