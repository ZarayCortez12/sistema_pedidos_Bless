"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Usuario.hasMany(models.UsuarioRol, {
        foreignKey: "usuarioId",
        as: "roles",
      });

      Usuario.hasOne(models.BloqueoUsuario, {
        foreignKey: "usuarioId",
        as: "bloqueo",
      });
    }
  }
  Usuario.init(
    {
      documento: DataTypes.STRING,
      nombres: DataTypes.STRING,
      apellidos: DataTypes.STRING,
      email: DataTypes.STRING,
      clave: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Usuario",
      tableName: "usuarios",
      freezeTableName: true,
    },
  );
  return Usuario;
};
