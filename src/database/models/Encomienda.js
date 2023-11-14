const { DataTypes, INTEGER } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("encomienda", {
    id: {
      type: DataTypes.BIGINT(),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      
    },
    remitenteId: {
      type: DataTypes.UUID,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    destinatarioId: {
      type: DataTypes.UUID,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    origenId: {
      type: DataTypes.UUID,
      references: {
        model: "ubicacions",
        key: "id",
      },
    },
    destinoId: {
      type: DataTypes.UUID,
      references: {
        model: "ubicacions",
        key: "id",
      },
    },
    productoId: {
      type: DataTypes.UUID,
      references: {
        model: "productos",
        key: "id",
      },
    },
    descripcion: {
      allowNull: false,
      type: DataTypes.STRING,
      length: 50,
    },
    sedeId: {
      type: DataTypes.UUID,
      references: {
        model: "sedes",
        key: "id",
      },
    },
    tipoProducto: {
      allowNull: true,
      type: DataTypes.STRING,
      length: 50,
    },
    valorSeguro: {
      allowNull: true,
      type: DataTypes.DOUBLE,
    },
    otrosCobros: {
      allowNull: true,
      type: DataTypes.DOUBLE,
    },
    valorFlete: {
      allowNull: true,
      type: DataTypes.DOUBLE,
    },
    recargos: {
      allowNull: true,
      type: DataTypes.DOUBLE,
    },
    descuento: {
      allowNull: true,
      type: DataTypes.DOUBLE,
    },
    formaPago: {
      allowNull: true,
      type: DataTypes.STRING,
    },
  });
};
