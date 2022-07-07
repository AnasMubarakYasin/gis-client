import { createSlice } from "@reduxjs/toolkit";

const k_token = "token";
/**
 * @type {Client.Store.User}
 */
const initial = {
  storage: "local",
  account: null,
  token: null,
  isFresh: false,
  isUninit: true,
  isLoggedIn: false,
  isLoggedOut: false,
};

export const accountSlice = createSlice({
  name: "user",
  initialState: () => {
    if (typeof window === "undefined") {
      return initial;
    }
    const data = { ...initial };
    const storage = data.storage == "session" ? sessionStorage : localStorage;
    const raw = storage.getItem(k_token);
    if (!raw) {
      storage.setItem(k_token, "");
    } else {
      try {
        data.token = JSON.parse(raw);
      } catch (error) {
        storage.setItem(k_token, "");
      }
    }
    return data;
  },
  reducers: {
    login: (
      /** @type {Client.Store.User} */ state,
      { payload: { account, token, remember } }
    ) => {
      state.isFresh = false;
      state.isUninit = false;
      state.isLoggedIn = true;
      state.isLoggedOut = false;

      state.token = token;
      state.account = account;
      state.storage = remember ? "local" : "session";

      const storage =
        state.storage == "session" ? sessionStorage : localStorage;
      storage.setItem(k_token, JSON.stringify(token));
    },
    refresh: (
      /** @type {Client.Store.User} */ state,
      { payload: { account, token } }
    ) => {
      if (state.isUninit) {
        state.isUninit = false;
        state.isLoggedIn = true;
        state.isLoggedOut = false;
      }
      state.isFresh = true;

      state.token = token;
      state.account = account;

      const storage =
        state.storage == "session" ? sessionStorage : localStorage;
      storage.setItem(k_token, JSON.stringify(token));
    },
    logout: (/** @type {Client.Store.User} */ state, {}) => {
      state.token = null;
      state.account = null;
      state.isFresh = false;
      state.isLoggedIn = false;
      state.isLoggedOut = true;

      const storage =
        state.storage == "session" ? sessionStorage : localStorage;
      storage.removeItem(k_token);
    },
  },
});

export default accountSlice.reducer;
export const { login, refresh, logout } = accountSlice.actions;
