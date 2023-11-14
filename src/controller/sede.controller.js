const { models } = require("../database/connection");

async function getAll(req, res) {
  try {
    const sede = await models.sede.findAll();

    sede != undefined ? res.send(JSON.stringify(sede)) : res.send("{}");
  } catch (error) {
    console.error(error);
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
  }
}

async function createOne(req, res) {
  try {
    const sede = req.body.data;

    const ubicacion = await models.ubicacion.create(sede.ubicacion);

    const sedes = await models.sede.create({
      nombre: sede.nombre,
      ubicacion: ubicacion.getDataValue('id')
    });

    sede != undefined ? res.send(JSON.stringify(sedes)) : res.send("{}");
  } catch (error) {
    console.error(error);
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
  }
}

module.exports = { getAll, createOne };
