import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import user from "@/store/user";
import { projectsApi } from "@/store/projects";
import { tasksApi } from "@/store/tasks";
import { membersApi } from "@/store/members";
import { rolesApi } from "@/store/roles";

const store = configureStore({
  reducer: {
    user,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    [membersApi.reducerPath]: membersApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      projectsApi.middleware,
      tasksApi.middleware,
      membersApi.middleware,
      rolesApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
