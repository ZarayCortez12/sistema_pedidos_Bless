import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import TallasService from "./talla.service.js";

export const listarTallas = createAsyncThunk(
  "tallas/listarTallas",
  async (_, thunkAPI) => {
    try {
      const response = await TallasService.listarTallas();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message,
        status: error.response?.status,
      });
    }
  },
);

export const agregarTalla = createAsyncThunk(
  "tallas/agregarTalla",
  async (nombre, thunkAPI) => {
    try {
      const response = await TallasService.agregarTalla(nombre);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message,
        status: error.response?.status,
      });
    }
  },
);

export const resetState = createAction("Reset_all");

const initialState = {
  tallas: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  isExisting: false,
  message: "",
  expiresAt: null,
};

const tallasSlice = createSlice({
  name: "tallas",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listarTallas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tallas = action.payload.tallas;
        state.message = action.payload.message;
      })
      .addCase(agregarTalla.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tallas.push(action.payload.talla);
        state.message = action.payload.message;
      })
      .addCase(resetState, (state) => {
        state.tallas = null;
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
        state.expiresAt = null;
      });
  },
});

export default tallasSlice.reducer;
