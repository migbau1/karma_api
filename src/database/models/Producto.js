const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("producto", {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    nombre: {
      allowNull: false,
      type: DataTypes.STRING,
      length: 50,
    },
    peso: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pesoCob: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    pesoVol: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    valorDeclarado: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  });
};
