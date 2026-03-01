const { Talla, ProductoTalla } = require("../../models");

const listarTallas = async (req, res) => {
  try {
    const tallas = await Talla.findAll();
    return res.json({
      message: "Tallas obtenidas correctamente",
      tallas,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

const agregarTalla = async (req, res) => {
  try {
    console.log("Agregando talla:", req.body);
    const { nombre } = req.body;

    const talla = await Talla.create({ nombre });

    return res.json({
      message: "Talla agregada correctamente",
      talla,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = { listarTallas, agregarTalla };
