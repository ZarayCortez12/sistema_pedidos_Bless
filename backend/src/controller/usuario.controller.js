const { Usuario, Rol, UsuarioRol, BloqueoUsuario } = require("../models");
const bcrypt = require("bcrypt");
const {
  getToken,
  generateRefreshToken,
  getTokenData,
} = require("../configs/jwt.config");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { numero_documento, clave } = req.body;

    const usuario = await Usuario.findOne({
      where: { numero_documento },
      include: [
        {
          model: Rol,
          attributes: ["rolId", "nombreRol"],
        },
        {
          model: BloqueoUsuario,
          attributes: ["usuarioId", "intentosFallidos", "bloqueadoHasta"],
        },
      ],
    });

    if (!usuario) {
      return res
        .status(404)
        .json({ message: "Usuario no registrado en el sistema" });
    }

    const bloqueo = usuario.BloqueoUsuario;
    const ahora = new Date();

    if (bloqueo && bloqueo.bloqueadoHasta) {
      if (bloqueo.bloqueadoHasta > ahora) {
        const minutos = Math.ceil(
          (bloqueo.bloqueadoHasta - ahora) / (1000 * 60),
        );

        return res.status(403).json({
          message: `Usuario bloqueado. Intente nuevamente en ${minutos} minuto(s).`,
        });
      } else {
        await bloqueo.update({
          intentosFallidos: 0,
          bloqueadoHasta: null,
          updatedAt: new Date(),
        });
      }
    }

    const contrasenaCorrecta = await bcrypt.compare(clave, usuario.clave);

    if (!contrasenaCorrecta) {
      let intentos = 1;

      if (bloqueo) {
        intentos = bloqueo.intentosFallidos + 1;

        if (intentos >= 3) {
          const bloqueadoHasta = new Date(Date.now() + 10 * 60 * 1000);

          await bloqueo.update({
            intentosFallidos: intentos,
            bloqueadoHasta: bloqueadoHasta,
            updatedAt: new Date(),
          });

          return res.status(403).json({
            message:
              "Has excedido el número de intentos. Usuario bloqueado por 10 minutos.",
          });
        } else {
          await bloqueo.update({
            intentosFallidos: intentos,
            updatedAt: new Date(),
          });
        }
      } else {
        await BloqueoUsuario.create({
          usuarioId: usuario.id,
          intentosFallidos: 1,
          bloqueadoHasta: null,
        });
      }

      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    if (bloqueo) {
      await bloqueo.update({
        intentosFallidos: 0,
        bloqueadoHasta: null,
        updatedAt: new Date(),
      });
    }

    const rolesLimpios = usuario.Rols.map((rol) => ({
      id_rol: rol.id,
      nombre_rol: rol.nombre,
    }));

    const rolActivo = rolesLimpios.length > 0 ? rolesLimpios[0].nombre : null;

    const payload = {
      id: usuario.id,
      numero_documento: usuario.documento,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
      rol_activo: rolActivo,
      roles: rolesLimpios,
    };

    const { token: accessToken, expiresIn } = getToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.json({
      message: "Inicio de sesión exitoso",
      usuario: payload,
      expiresIn,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error en el inicio de sesión. Intenta más tarde" });
  }
};

module.exports = {
  login,
};
