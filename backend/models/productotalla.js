"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductoTalla extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductoTalla.belongsTo(models.Producto, {
        foreignKey: "productoId",
      });

      ProductoTalla.belongsTo(models.Talla, {
        foreignKey: "tallaId",
      });
    }
  }
  ProductoTalla.init(
    {
      productoId: DataTypes.INTEGER,
      tallaId: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ProductoTalla",
      tableName: "producto_tallas",
      freezeTableName: true,
    },
  );
  return ProductoTalla;
};
