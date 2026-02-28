"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cliente.hasMany(models.Pedido, {
        foreignKey: "clienteId",
      });
    }
  }
  Cliente.init(
    {
      documento: DataTypes.STRING,
      nombres: DataTypes.STRING,
      apellidos: DataTypes.STRING,
      email: DataTypes.STRING,
      direccion: DataTypes.STRING,
      telefono: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Cliente",
      tableName: "clientes",
      freezeTableName: true,
    },
  );
  return Cliente;
};
