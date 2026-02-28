"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pedido.belongsTo(models.Cliente, {
        foreignKey: "clienteId",
      });

      Pedido.hasMany(models.DetallePedido, {
        foreignKey: "pedidoId",
      });

      Pedido.belongsTo(models.Usuario, {
        foreignKey: "usuarioId",
      });
    }
  }
  Pedido.init(
    {
      clienteId: DataTypes.INTEGER,
      usuarioId: DataTypes.INTEGER,
      total: DataTypes.FLOAT,
      fecha: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Pedido",
      tableName: "pedidos",
      freezeTableName: true,
    },
  );
  return Pedido;
};
