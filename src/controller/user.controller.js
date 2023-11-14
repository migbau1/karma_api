const { models } = require("../database/connection");
const sequelize = require("../database/connection");

var util = require("util");
const { fn, col, literal, Op } = require("sequelize");

const PER_PAGE = 10;

function getPaginatedItems(items, offset) {
  return items.slice(offset, offset + PER_PAGE);
}

async function getAll(req, res) {
  const t = await sequelize.transaction();
  try {
    const users = await models.usuario.findAll({
      include: models.ubicacion,
      order: ["nombre"],
    });

    let offset = req.body.offset ? parseInt(req.body.offset, 10) : 0;
    let nextOffset = offset + PER_PAGE;
    let previousOffset = offset - PER_PAGE < 1 ? 0 : offset - PER_PAGE;

    let meta = {
      limit: PER_PAGE,
      next: util.format("?limit=%s&offset=%s", PER_PAGE, nextOffset),
      offset: req.body.offset,
      previous: util.format("?limit=%s&offset=%s", PER_PAGE, previousOffset),
      total_count: users.length,
    };

    let json = {
      meta: meta,
      data: getPaginatedItems(users, offset),
    };

    users != undefined ? res.send(JSON.stringify(json)) : res.send("{}");

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

async function getByCedula(req, res) {
  const t = await sequelize.transaction();
  try {
    const user = await models.usuario.findOne({
      where: {
        cedula: req.params.cedula,
      },
      include: [
        {
          model: models.ubicacion,
          as: "ubicacion",
        },
      ],
    });
    user != undefined ? res.send(JSON.stringify(user)) : res.send("{}");
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

async function updateUser(req, res) {
  const t = await sequelize.transaction();
  const { ubicacion, nombre, apellido, cedula, telefono } = req.body;
  try {
    const usuario = await models.usuario.findOne({
      where: {
        cedula: req.params.cedula,
      },
      include: [
        {
          model: models.ubicacion,
          as: ubicacion,
        },
      ],
      transaction: t,
    });

    if (usuario.ubicacion) {
      usuario.ubicacion.update(ubicacion);

      usuario.update({
        nombre: nombre,
        apellido: apellido,
        cedula: cedula,
        telefono: telefono,
      });
    } else {
      const newUbi = await models.ubicacion.create(ubicacion, {
        transaction: t,
      });

      await usuario.update(
        {
          nombre: nombre,
          apellido: apellido,
          cedula: cedula,
          telefono: telefono,
          ubicacionId: newUbi.getDataValue("id"),
        },
        {
          transaction: t,
        }
      );
    }

    usuario != undefined
      ? res.send(JSON.stringify(usuario.get()))
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

async function createOne(req, res) {
  const t = await sequelize.transaction();
  try {
    const user = req.body.data;
    let users = null;

    if (user.ubicacion !== undefined) {
      const ubicacion = await models.ubicacion.create(user.ubicacion, {
        transaction: t,
      });
      users = await models.usuario.create(
        {
          nombre: user.nombre,
          apellido: user.apellido,
          cedula: user.cedula,
          telefono: user.telefono,
          ubicacionId: ubicacion.getDataValue("id"),
          rol: user.rol,
        },
        { transaction: t }
      );
    } else {
      users = await models.usuario.create(
        {
          nombre: user.nombre,
          apellido: user.apellido,
          cedula: user.cedula,
          telefono: user.telefono,
          rol: user.rol,
        },
        { transaction: t }
      );
    }

    await t.commit();
    users != undefined ? res.send(JSON.stringify(users)) : res.send("{}");
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
  }
}

async function getRemitentes(req, res) {
  try {
    const users = await sequelize.query(
      `SELECT DISTINCT encomienda.remitenteId, remitente.nombre FROM encomiendas as encomienda
      INNER JOIN usuarios AS remitente 
      ON remitente.id = encomienda.remitenteId
      ORDER BY remitente.nombre ASC`
    );

    res.send(users[0]);
  } catch (error) {
    console.error(error);
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
  }
}

async function searchEngineUser(req, res) {
  const t = await sequelize.transaction();

  const f = req.body.f;
  try {
    const users = await models.usuario.findAll({
      include: models.ubicacion,
      order: ["nombre"],
      where: {
        [Op.or]: [
          {
            nombre: {
              [Op.like]: f,
            },
          },
          {
            apellido: {
              [Op.like]: f,
            },
          },
          {
            cedula: {
              [Op.like]: f,
            },
          },
        ],
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
      total_count: users.length,
    };

    let json = {
      meta: meta,
      data: getPaginatedItems(users, offset),
    };

    users != undefined ? res.send(json) : res.send("{}");

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

module.exports = {
  getAll,
  createOne,
  getByCedula,
  updateUser,
  getRemitentes,
  searchEngineUser,
};
