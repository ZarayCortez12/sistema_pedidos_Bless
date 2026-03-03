import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import UsuarioService from "./usuario.service";

export const login = createAsyncThunk(
  "usuario/login",
  async (credenciales, thunkAPI) => {
    try {
      const response = await UsuarioService.login(credenciales);
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

export const obtenerUsuarioActual = createAsyncThunk(
  "usuario/obtenerUsuarioActual",
  async (_, thunkAPI) => {
    try {
      const response = await UsuarioService.obtenerUsuarioActual();
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

export const refrescarAccesToken = createAsyncThunk(
  "usuario/refrescarAccesToken",
  async (_, thunkAPI) => {
    try {
      const response = await UsuarioService.refreshAccessToken();
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

export const logout = createAsyncThunk(
  "usuario/logout",
  async (_, thunkAPI) => {
    try {
      const response = await UsuarioService.logout();
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
  usuario: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  isExisting: false,
  message: "",
  expiresAt: null,
};

const usuarioSlice = createSlice({
  name: "usuario",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.usuario = action.payload.usuario;
        state.message = action.payload.message;
        state.expiresAt = Date.now() + action.payload.expiresIn * 1000;
      })
      .addCase(obtenerUsuarioActual.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
        state.usuario = action.payload.usuario;
        state.expiresAt = Date.now() + action.payload.expiresIn * 1000;
      })
      .addCase(refrescarAccesToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        //state.message = action.payload.message;
        //state.usuario = action.payload.usuario;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        //state.message = action.payload.message;
        //state.usuario = null;
        state.expiresAt = null;
      });
  },
});

export default usuarioSlice.reducer;
