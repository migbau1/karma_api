const { models } = require("../database/connection");
const sequelize = require("../database/connection");
const { Op } = require("sequelize");
var util = require("util");
const Producto = require("../database/models/Producto");
const moment = require("moment-timezone");

const PER_PAGE = 10;

function getPaginatedItems(items, offset) {
  return items.slice(offset, offset + PER_PAGE);
}

async function getAll(req, res) {
  const t = await sequelize.transaction();
  try {
    const encomiendas = await models.encomienda.findAll({
      include: [
        {
          model: models.usuario,
          as: "destinatario",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt", "ubicacionId"],
          },
          order: ["createdAt"],
        },
        {
          model: models.usuario,
          as: "remitente",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt", "ubicacionId"],
          },
        },
        {
          model: models.ubicacion,
          as: "origen",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
        {
          model: models.ubicacion,
          as: "destino",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
        {
          model: models.producto,
          as: "producto",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
        {
          model: models.sede,
          as: "sede",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: ["descripcion", "id", "createdAt"],
    });

    let offset = req.body.offset ? parseInt(req.body.offset, 10) : 0;
    let nextOffset = offset + PER_PAGE;
    let previousOffset = offset - PER_PAGE < 1 ? 0 : offset - PER_PAGE;

    let meta = {
      limit: PER_PAGE,
      next: util.format("?limit=%s&offset=%s", PER_PAGE, nextOffset),
      offset: req.body.offset,
      previous: util.format("?limit=%s&offset=%s", PER_PAGE, previousOffset),
      total_count: encomiendas.length,
    };

    let json = {
      meta: meta,
      data: getPaginatedItems(encomiendas, offset),
    };

    encomiendas != undefined ? res.send(JSON.stringify(json)) : res.send("{}");

    await t.commit();
  } catch (error) {
    console.error(error);
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
    await t.rollback();
  }
}

async function findOne(req, res) {
  const t = await sequelize.transaction();

  try {
    const encomienda = await models.encomienda.findByPk(req.params.id, {
      include: [
        {
          model: models.usuario,
          as: "destinatario",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt", "ubicacionId"],
          },
          foreignKey: "destinatarioId",
          order: ["createdAt"],
        },
        {
          model: models.usuario,
          as: "remitente",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt", "ubicacionId"],
          },
          foreignKey: "remitenteId",
        },
        {
          model: models.ubicacion,
          as: "origen",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
        {
          model: models.ubicacion,
          as: "destino",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
        {
          model: models.producto,
          as: "producto",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
        {
          model: models.sede,
          as: "sede",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
      ],
      transaction: t,
      attributes: {
        exclude: [
          "remitenteId",
          "destinatarioId",
          "origenId",
          "productoId",
          "destinoId",
          "sedeId",
        ],
      },
    });

    await t.commit();

    encomienda != null
      ? res.send(JSON.stringify(encomienda.get()))
      : res.send("{}");
  } catch (error) {
    console.error(error);
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
    await t.rollback();
  }
}
async function findByUbication(req, res) {
  try {
    const t = await sequelize.transaction();

    const query = await models.encomienda.findAll({
      include: [
        {
          model: models.ubicacion,
          as: "destino",
          where: {
            departamento: req.body.ubicacion.departamento,
            municipio: req.body.ubicacion.municipio,
          },
        },
      ],
    });

    let offset = req.body.offset ? parseInt(req.body.offset, 10) : 0;
    let nextOffset = offset + PER_PAGE;
    let previousOffset = offset - PER_PAGE < 1 ? 0 : offset - PER_PAGE;

    let meta = {
      limit: PER_PAGE,
      next: util.format("?limit=%s&offset=%s", PER_PAGE, nextOffset),
      offset: req.body.offset,
      previous: util.format("?limit=%s&offset=%s", PER_PAGE, previousOffset),
      total_count: query.length,
    };

    let json = {
      meta: meta,
      data: getPaginatedItems(query, offset),
    };
    await t.commit();
    res.send(JSON.stringify(json));
  } catch (error) {
    console.error(error);
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
    await t.rollback();
  }
}

async function findByDate(req, res) {
  try {
    const t = await sequelize.transaction();

    const query = await models.encomienda.findAll({
      where: {
        createdAt: {
          [Op.between]: [req.body.fecha.desde, req.body.fecha.hasta],
        },
      },
    });

    let offset = req.body.offset ? parseInt(req.body.offset, 10) : 0;
    let nextOffset = offset + PER_PAGE;
    let previousOffset = offset - PER_PAGE < 1 ? 0 : offset - PER_PAGE;

    let meta = {
      limit: PER_PAGE,
      next: util.format("?limit=%s&offset=%s", PER_PAGE, nextOffset),
      offset: req.body.offset,
      previous: util.format("?limit=%s&offset=%s", PER_PAGE, previousOffset),
      total_count: query.length,
    };

    let json = {
      meta: meta,
      data: getPaginatedItems(query, offset),
    };
    await t.commit();
    res.send(JSON.stringify(json));
  } catch (error) {
    console.error(error);
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
    await t.rollback();
  }
}

async function editGuia(req, res) {
  const t = await sequelize.transaction();
  const coldate = moment().tz("America/Bogota");
  const {
    remitente,
    destinatario,
    origen,
    destino,
    valorSeguro,
    valorFlete,
    recargos,
    otrosCobros,
    descuento,
    producto,
  } = req.body;
  try {
    const encomienda = await models.encomienda.findByPk(req.params.id, {
      include: [
        {
          model: models.usuario,
          as: "destinatario",
        },
        {
          model: models.usuario,
          as: "remitente",
        },
        {
          model: models.ubicacion,
          as: "origen",
        },
        {
          model: models.ubicacion,
          as: "destino",
        },
        {
          model: models.producto,
          as: "producto",
        },
      ],
      transaction: t,
    });
    encomienda.destinatario.update(destinatario);
    encomienda.remitente.update(remitente);
    encomienda.origen.update(origen);
    encomienda.destino.update(destino);
    encomienda.producto.update(producto);
    await encomienda.update({
      valorSeguro: valorSeguro,
      valorFlete: valorFlete,
      recargos: recargos,
      otrosCobros: otrosCobros,
      descuento: descuento,
      updatedAt: coldate.toDate(),
    });

    res.send(encomienda.get());
    await t.commit();
  } catch (error) {
    console.error(error);
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
    await t.rollback();
  }
}

async function createOne(req, res) {
  const t = await sequelize.transaction();
  const coldate = moment().tz("America/Bogota");
  try {
    let {
      remitente,
      destinatario,
      ubicacionOrigen,
      ubicacionDestino,
      producto,
      sede,
      general,
    } = req.body.data;

    const ubicacionOri = await models.ubicacion.create(ubicacionOrigen, {
      transaction: t,
    });
    const ubicacionDesti = await models.ubicacion.create(ubicacionDestino, {
      transaction: t,
    });

    const pro = await models.producto.create(producto, { transaction: t });

    let validate = await validateOrCreateUserByCc({ remitente, destinatario });
    const tempEncomienda = await models.encomienda.create(
      {
        remitenteId: validate.remitente.id,
        destinatarioId: validate.destinatario.id,
        origenId: ubicacionOri.getDataValue("id"),
        destinoId: ubicacionDesti.getDataValue("id"),
        productoId: pro.getDataValue("id"),
        descripcion: general.descripcion,
        sedeId: sede.id,
        tipoProducto: general.tipoProducto,
        valorSeguro: general.valorSeguro,
        otrosCobros: general.otrosCobros,
        valorFlete: general.valorFlete,
        recargos: general.recargos,
        descuento: general.descuento,
        formaPago: general.formaPago,
        createdAt: coldate.format(),
      },
      { transaction: t }
    );


    req.body.data != undefined
      ? res.send(JSON.stringify(tempEncomienda))
      : res.send("{}");
    await t.commit();
  } catch (error) {
    console.error(error);
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
    await t.rollback();
  }
}

async function validateOrCreateUserByCc({ remitente, destinatario }) {
  const t = await sequelize.transaction();
  let response = {};
  try {
    const queryRemitente = await models.usuario.findOne({
      where: {
        cedula: remitente.cedula,
      },
    });

    const queryDestinatario = await models.usuario.findOne({
      where: {
        cedula: destinatario.cedula,
      },
    });

    if (queryRemitente === null) {
      let temp = await models.usuario.create({
        nombre: remitente.nombre,
        apellido: remitente.apellido,
        cedula: remitente.cedula,
        telefono: remitente.telefono,
        rol: remitente.rol,
      });
      response.remitente = temp.get();
    } else {
      response.remitente = queryRemitente.get();
    }

    if (queryDestinatario === null) {
      let temp = await models.usuario.create({
        nombre: destinatario.nombre,
        apellido: destinatario.apellido,
        cedula: destinatario.cedula,
        telefono: destinatario.telefono,
        rol: destinatario.rol,
      });
      response.destinatario = temp.get();
    } else {
      response.destinatario = queryDestinatario.get();
    }

    await t.commit();
    return response;
  } catch (error) {
    console.error(error);
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
    await t.rollback();
  }
}

module.exports = {
  getAll,
  createOne,
  findOne,
  editGuia,
  findByUbication,
  findByDate,
};
