"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Producto.hasMany(models.ProductoTalla, {
        foreignKey: "productoId",
      });

      Producto.hasMany(models.DetallePedido, {
        foreignKey: "productoId",
      });
    }
  }
  Producto.init(
    {
      nombre: DataTypes.STRING,
      codigo: DataTypes.STRING,
      precio: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Producto",
      tableName: "productos",
      freezeTableName: true,
    },
  );
  return Producto;
};
