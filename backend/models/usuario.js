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
      // define association here
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
