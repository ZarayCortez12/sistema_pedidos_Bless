const express = require("express");
const {
  listarClientes,
  agregarCliente,
  editarCliente,
  eliminarCliente,
} = require("../controller/cliente.controller");

const { verificarToken } = require("../configs/verificarToken");

const router = express.Router();

router.get("/", verificarToken, listarClientes);
router.post("/", verificarToken, agregarCliente);
router.put("/:id", verificarToken, editarCliente);
router.delete("/:id", verificarToken, eliminarCliente);

module.exports = router;
