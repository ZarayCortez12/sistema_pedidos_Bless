const { Usuario, Rol, UsuarioRol, BloqueoUsuario } = require("../../models");
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
    const { documento, clave } = req.body;

    const usuario = await Usuario.findOne({
      where: { documento },
      include: [
        {
          model: UsuarioRol,
          as: "roles",
          include: [
            {
              model: Rol,
              attributes: ["id", "nombre"],
            },
          ],
        },

        {
          model: BloqueoUsuario,
          as: "bloqueo",
          attributes: ["id", "usuarioId", "intentosFallidos", "bloqueadoHasta"],
        },
      ],
    });

    if (!usuario) {
      return res
        .status(404)
        .json({ message: "Usuario no registrado en el sistema" });
    }

    const bloqueo = usuario.bloqueo;
    const ahora = new Date();

    if (bloqueo && bloqueo.bloqueadoHasta) {
      if (bloqueo.bloqueadoHasta > ahora) {
        const minutos = Math.ceil(
          (bloqueo.bloqueadoHasta - ahora) / (1000 * 60),
        );

        return res.status(200).json({
          type: "info",
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

        if (intentos > 3) {
          const bloqueadoHasta = new Date(Date.now() + 10 * 60 * 1000);

          await bloqueo.update({
            intentosFallidos: intentos,
            bloqueadoHasta: bloqueadoHasta,
            updatedAt: new Date(),
          });

          return res.status(200).json({
            type: "warning",
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

    const rolesLimpios = usuario.roles.map((rol) => ({
      id: rol.Rol.id,
      nombre: rol.Rol.nombre,
    }));

    const rolActivo = rolesLimpios.length > 0 ? rolesLimpios[0].nombre : null;

    const payload = {
      id: usuario.id,
      documento: usuario.documento,
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //console.log("Usuario que va a devolver:", payload);

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

const obtenerUsuarioActual = async (req, res) => {
  try {
    let decoded;

    console.log("Aca estamos");

    decoded = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET);

    console.log("Token decodificado:", decoded);

    const usuario = await Usuario.findOne({
      where: { id: decoded.data.id },
      include: [
        {
          model: UsuarioRol,
          as: "roles",
          include: [
            {
              model: Rol,
              attributes: ["id", "nombre"],
            },
          ],
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const rolesLimpios = usuario.roles.map((rol) => ({
      id: rol.Rol.id,
      nombre: rol.Rol.nombre,
    }));

    return res.json({
      usuario: {
        id: usuario.id,
        documento: usuario.documento,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol_activo: decoded.data.rol_activo,
        roles: rolesLimpios,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error del servidorXXX" });
  }
};

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No hay refresh token" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Refresh inválido" });
    const usuarioRefresh = payload.data;

    try {
      const usuario = await Usuario.findOne({
        where: { id_usuario: usuarioRefresh.id },
        include: [
          {
            model: Rol,
            attributes: ["id_rol", "nombre_rol"],
            through: {
              attributes: [],
              where: { estado_rol: "activo" },
            },
          },
        ],
      });

      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const rolesLimpios = usuario.Rols.map((rol) => ({
        id_rol: rol.id_rol,
        nombre_rol: rol.nombre_rol,
      }));

      const rolActivo =
        rolesLimpios.length > 0 ? rolesLimpios[0].nombre_rol : null;

      const payloadData = {
        id: usuario.id_usuario,
        tipo_documento: usuario.tipo_documento,
        numero_documento: usuario.numero_documento,
        primer_nombre: usuario.primer_nombre,
        segundo_nombre: usuario.segundo_nombre,
        primer_apellido: usuario.primer_apellido,
        segundo_apellido: usuario.segundo_apellido,
        correo: usuario.correo_electronico,
        fecha_nacimiento: usuario.fecha_nacimiento,
        telefono: usuario.telefono,
        codigo_institucional: usuario.codigo_institucional,
        genero: usuario.genero,
        nivel_educativo: usuario.nivel_estudio_superior,
        fecha_registro: usuario.fecha_registro,
        roles: rolesLimpios,
      };

      const { token: accessToken, expiresIn } = getToken(payloadData);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 60 * 60 * 1000,
      });

      res.json({
        message: "Sesión extendida correctamente",
        usuario: payloadData,
        expiresIn,
      });
    } catch (error) {
      res.status(500).json({ message: "Error al refrescar sesión" });
    }
  });
};

const logout = (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.json({ message: "Sesión cerrada correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al cerrar sesión" });
  }
};

module.exports = {
  login,
  obtenerUsuarioActual,
  refreshAccessToken,
  logout,
};
