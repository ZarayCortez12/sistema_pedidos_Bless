import axios from "axios";
import { base_url } from "../utils/baseUrl";

const login = async (credenciales) => {
  try {
    const response = await axios.post(`${base_url}/usuario`, credenciales, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const obtenerUsuarioActual = async () => {
  try {
    const response = await axios.get(`${base_url}/usuario/actual`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${base_url}/usuario/refresh-token`,
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  try {
    console.log("Logout de usuario");
    const response = await axios.post(
      `${base_url}/usuario/logout`,
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const UsuarioService = {
  login,
  obtenerUsuarioActual,
  refreshAccessToken,
  logout,
};

export default UsuarioService;
