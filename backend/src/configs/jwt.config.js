const jwt = require("jsonwebtoken");

const getToken = (payload) => {
  const expiresInSeconds = 60 * 60; // 60 minutos → 3600segundos

  const token = jwt.sign({ data: payload }, process.env.JWT_SECRET, {
    expiresIn: expiresInSeconds,
  });

  return {
    token,
    expiresIn: expiresInSeconds, // lo enviamos al frontend
  };
};

const getTokenData = (token) => {
  console.log("getTokenData", token);
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign({ data: payload }, process.env.REFRESH_SECRET, {
    expiresIn: "3d",
  });
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No autorizado, token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = {
  getToken,
  getTokenData,
  generateRefreshToken,
  authMiddleware,
};
