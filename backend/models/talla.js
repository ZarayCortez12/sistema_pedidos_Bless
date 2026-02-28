"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Talla extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Talla.init(
    {
      nombre: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Talla",
      tableName: "tallas",
      freezeTableName: true,
    },
  );
  return Talla;
};
