import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginRequest, getMe, logoutRequest } from "../api/auth.api";

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res = await loginRequest(data);
    return res.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Login failed"
    );
  }
});

export const loadUser = createAsyncThunk("auth/loadUser", async (_, thunkAPI) => {
  try {
    const res = await getMe();
    return res.user;
  } catch {
    return thunkAPI.rejectWithValue(null);
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, thunkAPI) => {
  try {
    await logoutRequest();
    return true;
  } catch {
    return thunkAPI.rejectWithValue(null);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  },
  reducers: {
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;