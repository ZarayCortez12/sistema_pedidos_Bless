const express = require("express");
const {
  listarProductos,
  agregarProducto,
  editarProducto,
  eliminarProducto,
  ingresarStockAProducto,
  agregarTallaAProducto,
  listarProductosConTallas,
} = require("../controller/productos.controller");

const { verificarToken } = require("../configs/verificarToken");

const router = express.Router();

router.get("/", verificarToken, listarProductos);
router.get("/tallas", verificarToken, listarProductosConTallas);
router.post("/", verificarToken, agregarProducto);
router.put("/:id", verificarToken, editarProducto);
router.delete("/:id", verificarToken, eliminarProducto);
router.post("/stock", verificarToken, ingresarStockAProducto);
router.post("/talla", verificarToken, agregarTallaAProducto);

module.exports = router;
