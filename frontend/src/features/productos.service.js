import axios from "axios";
import { base_url } from "../utils/baseUrl";

const listarProductos = async () => {
  try {
    const response = await axios.get(`${base_url}/productos`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const agregarProducto = async (producto) => {
  try {
    const response = await axios.post(`${base_url}/productos`, producto, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const editarProducto = async (id, precio) => {
  try {
    console.log("ID del producto a editar:", id);
    console.log("Datos a editar:", precio);
    const response = await axios.put(
      `${base_url}/productos/${id}`,
      { precio },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const eliminarProducto = async (id) => {
  try {
    const response = await axios.delete(`${base_url}/productos/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const ingresarStockAProducto = async (datos) => {
  try {
    const response = await axios.post(`${base_url}/productos/stock`, datos, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const agregarTallaAProducto = async (datos) => {
  try {
    const response = await axios.post(`${base_url}/productos/talla`, datos, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const listarProductosConTallas = async () => {
  try {
    const response = await axios.get(`${base_url}/productos/tallas`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const ProductosService = {
  listarProductos,
  agregarProducto,
  editarProducto,
  eliminarProducto,
  ingresarStockAProducto,
  agregarTallaAProducto,
  listarProductosConTallas,
};

export default ProductosService;
