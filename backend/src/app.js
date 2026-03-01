const express = require("express");
const config = require("./config");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("../models");
const usuarioRoutes = require("./routes/usuario.routes");
const productosRoutes = require("./routes/productos.routes");
const tallasRoutes = require("./routes/talla.routes");

const allowedOrigins = ["http://localhost:5173"];

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.set("port", config.app.port);

app.use(express.json());

app.use("/usuario", usuarioRoutes);
app.use("/productos", productosRoutes);
app.use("/tallas", tallasRoutes);

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Base de datos conectada");
  })
  .catch((err) => {
    console.error("Error BD:", err);
  });

module.exports = app;
