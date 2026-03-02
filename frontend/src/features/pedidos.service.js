import axios from "axios";
import { base_url } from "../utils/baseUrl";

export const listarPedidosDeCliente = async (id) => {
  try {
    const response = await axios.get(`${base_url}/pedidos/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const detallesPedido = async (pedidoId) => {
  try {
    const response = await axios.get(
      `${base_url}/pedidos/${pedidoId}/detalles`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const listarPedidos = async () => {
  try {
    const response = await axios.get(`${base_url}/pedidos`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const agregarPedido = async (pedido) => {
  try {
    const response = await axios.post(`${base_url}/pedidos`, pedido, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const PedidosService = {
  listarPedidosDeCliente,
  detallesPedido,
  listarPedidos,
  agregarPedido,
};

export default PedidosService;
