const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "userCredentials",
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      email: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      password: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      name: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "userCredentials",
    },
    {
      timestamps: false,
    }
  );
};
