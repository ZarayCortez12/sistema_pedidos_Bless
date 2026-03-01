const express = require("express");
const {
  listarTallas,
  agregarTalla,
} = require("../controller/talla.controller");

const { verificarToken } = require("../configs/verificarToken");

const router = express.Router();

router.get("/", verificarToken, listarTallas);
router.post("/", verificarToken, agregarTalla);

module.exports = router;
