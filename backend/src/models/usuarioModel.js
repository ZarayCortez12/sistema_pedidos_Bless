const { DataTypes } = require("sequelize");


const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nombres: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    clave: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  },
);

module.exports = Usuario;
