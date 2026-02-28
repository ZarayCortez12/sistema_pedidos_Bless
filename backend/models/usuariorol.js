"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UsuarioRol extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UsuarioRol.belongsTo(models.Usuario, {
        foreignKey: "usuarioId",
      });

      UsuarioRol.belongsTo(models.Rol, {
        foreignKey: "rolId",
      });
    }
  }
  UsuarioRol.init(
    {
      usuarioId: DataTypes.INTEGER,
      rolId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UsuarioRol",
      tableName: "usuario_roles",
      freezeTableName: true,
    },
  );
  return UsuarioRol;
};
