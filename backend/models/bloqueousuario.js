"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BloqueoUsuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BloqueoUsuario.belongsTo(models.Usuario, {
        foreignKey: "usuarioId",
      });
    }
  }
  BloqueoUsuario.init(
    {
      usuarioId: DataTypes.INTEGER,
      intentosFallidos: DataTypes.INTEGER,
      bloqueadoHasta: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "BloqueoUsuario",
      tableName: "bloqueo_usuario",
      freezeTableName: true,
    },
  );
  return BloqueoUsuario;
};
