const express = require("express");
const { login } = require("../controller/usuario.controller");

const { verificarToken } = require("../configs/verificarToken");

const router = express.Router();

router.post("/login", login);

module.exports = router;
