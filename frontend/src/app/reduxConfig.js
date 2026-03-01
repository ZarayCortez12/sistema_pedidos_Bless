import { configureStore } from "@reduxjs/toolkit";
import usuarioReducer from "../features/usuario.slice";
import productosReducer from "../features/productos.slice";
import tallasReducer from "../features/talla.slice";

export const reduxConfig = configureStore({
  reducer: {
    usuario: usuarioReducer,
    productos: productosReducer,
    tallas: tallasReducer,
  },
});
