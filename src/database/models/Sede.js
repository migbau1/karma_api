const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("sede", {
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
    ubicacion: {
      type: DataTypes.UUID,
      references: {
        model: "ubicacions",
        key: "id",
      },
    },
  });
};
