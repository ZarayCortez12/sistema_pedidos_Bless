const express = require("express");
const {
  listarPedidosDeCliente,
  detallesPedido,
  listarPedidos,
  agregarPedido,
} = require("../controller/pedidos.controller");

const { verificarToken } = require("../configs/verificarToken");

const router = express.Router();

router.get("/", verificarToken, listarPedidos);
router.get("/:id", verificarToken, listarPedidosDeCliente);
router.get("/:pedidoId/detalles", verificarToken, detallesPedido);
router.post("/", verificarToken, agregarPedido);

module.exports = router;
