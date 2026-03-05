import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSettings, updateSettings } from "../api/setting.api";

/* ===== LOAD SETTINGS ===== */
export const loadSettings = createAsyncThunk(
  "settings/loadSettings",
  async (_, thunkAPI) => {
    try {
      const data = await getSettings();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to load settings"
      );
    }
  }
);

/* ===== UPDATE SETTINGS ===== */
export const saveSettings = createAsyncThunk(
  "settings/saveSettings",
  async (payload, thunkAPI) => {
    try {
      const data = await updateSettings(payload);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to update settings"
      );
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    // haddii aad rabto local update
    setSettings: (state, action) => {
      state.data = action.payload;
    },
    clearSettings: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOAD SETTINGS
      .addCase(loadSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SAVE SETTINGS
      .addCase(saveSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // ✅ updated settings
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSettings, clearSettings } = settingsSlice.actions;
export default settingsSlice.reducer;