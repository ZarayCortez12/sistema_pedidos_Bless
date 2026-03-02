import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import ClientesService from "./clientes.service";

export const listarClientes = createAsyncThunk(
  "clientes/listarClientes",
  async (_, thunkAPI) => {
    try {
      const response = await ClientesService.listarClientes();
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

export const agregarCliente = createAsyncThunk(
  "clientes/agregarCliente",
  async (cliente, thunkAPI) => {
    try {
      const response = await ClientesService.agregarCliente(cliente);
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

export const editarCliente = createAsyncThunk(
  "clientes/editarCliente",
  async ({ id, datos }, thunkAPI) => {
    try {
      const response = await ClientesService.editarCliente(id, datos);
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

export const eliminarCliente = createAsyncThunk(
  "clientes/eliminarCliente",
  async (id, thunkAPI) => {
    try {
      const response = await ClientesService.eliminarCliente(id);
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
  clientes: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  isExisting: false,
  message: "",
  expiresAt: null,
};

const clientesSlice = createSlice({
  name: "clientes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listarClientes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.clientes = action.payload.clientes;
        state.message = action.payload.message;
      })
      .addCase(agregarCliente.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.clientes.push(action.payload.cliente);
        state.message = action.payload.message;
      })
      .addCase(editarCliente.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const indexCliente = state.clientes.findIndex(
          (c) => c.id === action.payload.cliente.id,
        );
        state.clientes[indexCliente] = action.payload.cliente;
        state.message = action.payload.message;
      })
      .addCase(eliminarCliente.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.clientes = state.clientes.filter(
          (c) => c.id !== action.payload.id,
        );
        state.message = action.payload.message;
      })
      .addCase(resetState, (state) => {
        state.clientes = null;
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
        state.expiresAt = null;
      });
  },
});

export default clientesSlice.reducer;
