import axios from "axios";
import { base_url } from "../utils/baseUrl";

const listarTallas = async () => {
  try {
    const response = await axios.get(`${base_url}/tallas`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const agregarTalla = async (nombre) => {
  try {
    const response = await axios.post(
      `${base_url}/tallas`,
      nombre,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const TallasService = {
  listarTallas,
  agregarTalla,
};

export default TallasService;
