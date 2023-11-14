function applyExtraSetup(sequelize) {
  const { encomienda, usuario, ubicacion, producto, sede } = sequelize.models;

  usuario.belongsTo(ubicacion);
  encomienda.belongsTo(usuario, { as: "remitente" });
  encomienda.belongsTo(usuario, { as: "destinatario" });
  encomienda.belongsTo(ubicacion, { as: "origen" });
  encomienda.belongsTo(ubicacion, { as: "destino" });
  encomienda.belongsTo(producto, { as: "producto" });

  encomienda.belongsTo(sede, { as: "sede" });
}

module.exports = { applyExtraSetup };
