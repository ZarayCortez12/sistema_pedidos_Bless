const express = require("express");
const {
  login,
  obtenerUsuarioActual,
  refreshAccessToken,
  logout,
} = require("../controller/usuario.controller");

const { verificarToken } = require("../configs/verificarToken");

const router = express.Router();

router.post("/", login);
router.get("/actual", verificarToken, obtenerUsuarioActual);
router.post("/refresh-token", verificarToken, refreshAccessToken);
router.post("/logout", verificarToken, logout);

module.exports = router;
