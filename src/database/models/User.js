const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("usuario", {
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
    apellido: {
      allowNull: false,
      type: DataTypes.STRING,
      length: 50,
    },
    cedula: {
      allowNull: false,
      type: DataTypes.STRING,
      length: 50,
      unique: true,
    },
    telefono: {
      type: DataTypes.TEXT,
    },
    rol: {
      // type: '"public"."enum_usuarios_rol"',
      type: DataTypes.ENUM({
        values: ["remitente", "destinatario", "empleado"],
      }),
    },
  });
};
