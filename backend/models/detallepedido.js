"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetallePedido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DetallePedido.belongsTo(models.Pedido, {
        foreignKey: "pedidoId",
      });

      DetallePedido.belongsTo(models.Producto, {
        foreignKey: "productoId",
      });

      DetallePedido.belongsTo(models.Talla, {
        foreignKey: "tallaId",
      });
    }
  }
  DetallePedido.init(
    {
      pedidoId: DataTypes.INTEGER,
      productoId: DataTypes.INTEGER,
      tallaId: DataTypes.INTEGER,
      cantidad: DataTypes.INTEGER,
      precio_unitario: DataTypes.FLOAT,
      subtotal: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "DetallePedido",
      tableName: "detalle_pedidos",
      freezeTableName: true,
    },
  );
  return DetallePedido;
};
