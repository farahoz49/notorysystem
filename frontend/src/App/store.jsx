// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import settingsReducer from "./settingsSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
     settings: settingsReducer, // ✅ ku dar
  },
});

export default store;