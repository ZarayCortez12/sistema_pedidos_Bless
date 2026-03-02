import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import PedidosService from "./pedidos.service";

export const listarPedidosDeCliente = createAsyncThunk(
  "pedidos/listarPedidosDeCliente",
  async (id, thunkAPI) => {
    try {
      const response = await PedidosService.listarPedidosDeCliente(id);
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

export const detallesPedido = createAsyncThunk(
  "pedidos/detallesPedido",
  async (pedidoId, thunkAPI) => {
    try {
      const response = await PedidosService.detallesPedido(pedidoId);
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

export const listarPedidos = createAsyncThunk(
  "pedidos/listarPedidos",
  async (_, thunkAPI) => {
    try {
      const response = await PedidosService.listarPedidos();
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

export const agregarPedido = createAsyncThunk(
  "pedidos/agregarPedido",
  async (pedido, thunkAPI) => {
    try {
      const response = await PedidosService.agregarPedido(pedido);
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
  pedidos: [],
  pedidosCliente: [],
  pedido: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  isExisting: false,
  message: "",
  expiresAt: null,
};

const pedidosSlice = createSlice({
  name: "pedidos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listarPedidosDeCliente.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pedidosCliente = action.payload.pedidos;
        state.message = action.payload.message;
      })
      .addCase(detallesPedido.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pedido = action.payload.pedido;
        state.message = action.payload.message;
      })
      .addCase(listarPedidos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pedidos = action.payload.pedidos;
        state.message = action.payload.message;
      })
      .addCase(agregarPedido.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.pedidos.push(action.payload.pedido);
        state.message = action.payload.message;
      })
      .addCase(resetState, (state) => {
        state.pedidos = null;
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
        state.expiresAt = null;
      });
  },
});

export default pedidosSlice.reducer;
