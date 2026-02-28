const express = require("express");
const config = require("./config");
const cors = require("cors");
const cookieParser = require("cookie-parser");

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

module.exports = app;
