import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import ProductosService from "./productos.service";

export const listarProductos = createAsyncThunk(
  "productos/listarProductos",
  async (_, thunkAPI) => {
    try {
      const response = await ProductosService.listarProductos();
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

export const agregarProducto = createAsyncThunk(
  "productos/agregarProducto",
  async (producto, thunkAPI) => {
    try {
      const response = await ProductosService.agregarProducto(producto);
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

export const editarProducto = createAsyncThunk(
  "productos/editarProducto",
  async ({ id, precio }, thunkAPI) => {
    try {
      const response = await ProductosService.editarProducto(id, precio);
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

export const eliminarProducto = createAsyncThunk(
  "productos/eliminarProducto",
  async (id, thunkAPI) => {
    try {
      const response = await ProductosService.eliminarProducto(id);
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

export const ingresarStockAProducto = createAsyncThunk(
  "productos/ingresarStockAProducto",
  async (datos, thunkAPI) => {
    try {
      const response = await ProductosService.ingresarStockAProducto(datos);
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

export const agregarTallaAProducto = createAsyncThunk(
  "productos/agregarTallaAProducto",
  async (datos, thunkAPI) => {
    try {
      const response = await ProductosService.agregarTallaAProducto(datos);
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
  productos: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  isExisting: false,
  message: "",
  expiresAt: null,
};

const productosSlice = createSlice({
  name: "productos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listarProductos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.productos = action.payload.productos;
        state.message = action.payload.message;
      })
      .addCase(agregarProducto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.productos.push(action.payload.producto);
        state.message = action.payload.message;
      })
      .addCase(editarProducto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const indexProducto = state.productos.findIndex(
          (p) => p.id === action.payload.producto.id,
        );
        state.productos[indexProducto] = action.payload.producto;
        state.message = action.payload.message;
      })
      .addCase(eliminarProducto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.productos = state.productos.filter(
          (p) => p.id !== action.payload.id,
        );
        state.message = action.payload.message;
      })
      .addCase(ingresarStockAProducto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const indexProducto = state.productos.findIndex(
          (p) => p.id === action.payload.producto.id,
        );
        state.productos[indexProducto] = action.payload.producto;
      })
      .addCase(agregarTallaAProducto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const indexProducto = state.productos.findIndex(
          (p) => p.id === action.payload.producto.id,
        );
        state.productos[indexProducto] = action.payload.producto;
      })
      .addCase(resetState, (state) => {
        state.productos = null;
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
        state.isExisting = false;
        state.message = "";
        state.expiresAt = null;
      });
  },
});

export default productosSlice.reducer;
