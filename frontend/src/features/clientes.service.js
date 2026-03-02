import axios from "axios";
import { base_url } from "../utils/baseUrl";

export const listarClientes = async () => {
  try {
    const response = await axios.get(`${base_url}/clientes`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return error;
  }
};

export const agregarCliente = async (cliente) => {
  try {
    const response = await axios.post(`${base_url}/clientes`, cliente, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editarCliente = async (id, datos) => {
  try {
    const response = await axios.put(`${base_url}/clientes/${id}`, datos, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const eliminarCliente = async (id) => {
  try {
    const response = await axios.delete(`${base_url}/clientes/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const ClientesService = {
  listarClientes,
  agregarCliente,
  editarCliente,
  eliminarCliente,
};

export default ClientesService;
