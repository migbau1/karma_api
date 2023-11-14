const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("ubicacion", {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    departamento: {
      allowNull: false,
      type: DataTypes.STRING,
      length: 50,
    },
    municipio: {
      allowNull: false,
      type: DataTypes.STRING,
      length: 50,
    },
    codigoPostal: {
      allowNull: false,
      type: DataTypes.INTEGER,
      length: 50,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
