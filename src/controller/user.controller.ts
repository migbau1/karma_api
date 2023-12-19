import { ModelCtor, Op } from 'sequelize'
import sequelize from '../database/connection'
import util from 'util'
import { Request, Response } from 'express';
import { IUserModel } from '../database/models/Usuarios';
import { IRolesModel } from '../database/models/Roles';
import { IUbicationModel } from '../database/models/Ubicacion';
import Roles from '../utils/roles/roles.pointer';
import { ICredencialesModel } from '../database/models/Credenciales';

// const { models } = require("../database/connection");
const usuarios = sequelize.model('usuarios') as ModelCtor<IUserModel>
const roles = sequelize.model('roles') as ModelCtor<IRolesModel>
const ubicaciones = sequelize.model('ubicacion') as ModelCtor<IUbicationModel>
const credenciales = sequelize.model('credenciales') as ModelCtor<ICredencialesModel>

const PER_PAGE = 10;

// function getPaginatedItems(items: Array<any>, offset: number) {
//   return items.slice(offset, offset + PER_PAGE);
// }

// async function getAll(req: Request, res: Response) {
//   const t = await sequelize.transaction();
//   try {
//     const users = await models.usuario.findAll({
//       include: models.ubicacion,
//       order: ["nombre"],
//     });

//     let offset = req.body.offset ? parseInt(req.body.offset, 10) : 0;
//     let nextOffset = offset + PER_PAGE;
//     let previousOffset = offset - PER_PAGE < 1 ? 0 : offset - PER_PAGE;

//     let meta = {
//       limit: PER_PAGE,
//       next: util.format("?limit=%s&offset=%s", PER_PAGE, nextOffset),
//       offset: req.body.offset,
//       previous: util.format("?limit=%s&offset=%s", PER_PAGE, previousOffset),
//       total_count: users.length,
//     };

//     let json = {
//       meta: meta,
//       data: getPaginatedItems(users, offset),
//     };

//     users != undefined ? res.send(JSON.stringify(json)) : res.send("{}");

//     await t.commit();
//   } catch (error: any) {
//     console.error(error);
//     res.send({
//       name: error.name,
//       type: error.parent.routine,
//       message: "ups, an error has occurred",
//     });
//     await t.rollback();
//   }
// }

// async function getByCedula(req: Request, res: Response) {
//   const t = await sequelize.transaction();
//   try {
//     const user = await models.usuario.findOne({
//       where: {
//         cedula: req.params.cedula,
//       },
//       include: [
//         {
//           model: models.ubicacion,
//           as: "ubicacion",
//         },
//       ],
//     });
//     user != undefined ? res.send(JSON.stringify(user)) : res.send("{}");
//     await t.commit();
//   } catch (error: any) {
//     console.error(error);
//     res.send({
//       name: error.name,
//       type: error.parent.routine,
//       message: "ups, an error has occurred",
//     });
//     await t.rollback();
//   }
// }

// async function updateUser(req: Request, res: Response) {
//   const t = await sequelize.transaction();
//   const { ubicacion, nombre, apellido, cedula, telefono } = req.body;
//   try {
//     const usuario = await models.usuario.findOne({
//       where: {
//         cedula: req.params.cedula,
//       },
//       include: [
//         {
//           model: models.ubicacion,
//           as: ubicacion,
//         },
//       ],
//       transaction: t,
//     });

//     if (usuario) {

//       // if (usuario.ubicacion) {
//       //   usuario.ubicacion.update(ubicacion);

//       //   usuario.update({
//       //     nombre: nombre,
//       //     apellido: apellido,
//       //     cedula: cedula,
//       //     telefono: telefono,
//       //   });
//       // } else {
//       //   const newUbi = await models.ubicacion.create(ubicacion, {
//       //     transaction: t,
//       //   });

//       //   await usuario.update(
//       //     {
//       //       nombre: nombre,
//       //       apellido: apellido,
//       //       cedula: cedula,
//       //       telefono: telefono,
//       //       ubicacionId: newUbi.getDataValue("id"),
//       //     },
//       //     {
//       //       transaction: t,
//       //     }
//       //   );
//       // }
//     }

//     usuario != undefined
//       ? res.send(JSON.stringify(usuario.get()))
//       : res.send("{}");
//     await t.commit();
//   } catch (error: any) {
//     console.error(error);
//     res.send({
//       name: error.name,
//       type: error.parent.routine,
//       message: "ups, an error has occurred",
//     });
//     await t.rollback();
//   }
// }

// async function createOne(req: Request, res: Response) {
//   const t = await sequelize.transaction();
//   try {
//     const user = req.body.data;
//     let users = null;

//     if (user.ubicacion !== undefined) {
//       const ubicacion = await models.ubicacion.create(user.ubicacion, {
//         transaction: t,
//       });
//       users = await models.usuario.create(
//         {
//           nombre: user.nombre,
//           apellido: user.apellido,
//           cedula: user.cedula,
//           telefono: user.telefono,
//           ubicacionId: ubicacion.getDataValue("id"),
//           rol: user.rol,
//         },
//         { transaction: t }
//       );
//     } else {
//       users = await models.usuario.create(
//         {
//           nombre: user.nombre,
//           apellido: user.apellido,
//           cedula: user.cedula,
//           telefono: user.telefono,
//           rol: user.rol,
//         },
//         { transaction: t }
//       );
//     }

//     await t.commit();
//     users != undefined ? res.send(JSON.stringify(users)) : res.send("{}");
//   } catch (error: any) {
//     await t.rollback();
//     console.error(error);
//     res.send({
//       name: error.name,
//       type: error.parent.routine,
//       message: "ups, an error has occurred",
//     });
//   }
// }

// async function getRemitentes(req: Request, res: Response) {
//   try {
//     const users = await sequelize.query(
//       `SELECT DISTINCT encomienda.remitenteId, remitente.nombre FROM encomiendas as encomienda
//       INNER JOIN usuarios AS remitente 
//       ON remitente.id = encomienda.remitenteId
//       ORDER BY remitente.nombre ASC`
//     );

//     res.send(users[0]);
//   } catch (error: any) {
//     console.error(error);
//     res.send({
//       name: error.name,
//       type: error.parent.routine,
//       message: "ups, an error has occurred",
//     });
//   }
// }

// async function searchEngineUser(req: Request, res: Response) {
//   const t = await sequelize.transaction();

//   const f = req.body.f;
//   try {
//     const users = await models.usuario.findAll({
//       include: models.ubicacion,
//       order: ["nombre"],
//       where: {
//         [Op.or]: [
//           {
//             nombre: {
//               [Op.like]: f,
//             },
//           },
//           {
//             apellido: {
//               [Op.like]: f,
//             },
//           },
//           {
//             cedula: {
//               [Op.like]: f,
//             },
//           },
//         ],
//       },
//     });

//     let offset = req.body.offset ? parseInt(req.body.offset, 10) : 0;
//     let nextOffset = offset + PER_PAGE;
//     let previousOffset = offset - PER_PAGE < 1 ? 0 : offset - PER_PAGE;

//     let meta = {
//       limit: PER_PAGE,
//       next: util.format("?limit=%s&offset=%s", PER_PAGE, nextOffset),
//       offset: req.body.offset,
//       previous: util.format("?limit=%s&offset=%s", PER_PAGE, previousOffset),
//       total_count: users.length,
//     };

//     let json = {
//       meta: meta,
//       data: getPaginatedItems(users, offset),
//     };

//     users != undefined ? res.send(json) : res.send("{}");

//     await t.commit();
//   } catch (error: any) {
//     console.error(error);
//     res.send({
//       name: error.name,
//       type: error.parent.routine,
//       message: "ups, an error has occurred",
//     });
//     await t.rollback();
//   }
// }

export {
  // getAll,
  // createOne,
  // getByCedula,
  // updateUser,
  // getRemitentes,
  // searchEngineUser,
};
