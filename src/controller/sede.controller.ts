import { Request, Response } from "express";
import sequelize from "../database/connection";

const { models } = sequelize

async function getAll(req: Request, res: Response) {
  try {
    const sede = await models.sede.findAll();

    sede != undefined ? res.send(JSON.stringify(sede)) : res.send("{}");
  } catch (error: any) {
    console.error(error);
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
  }
}

async function createOne(req: Request, res: Response) {
  try {
    const sede = req.body.data;

    const ubicacion = await models.ubicacion.create(sede.ubicacion);

    const sedes = await models.sede.create({
      nombre: sede.nombre,
      ubicacion: ubicacion.getDataValue('id')
    });

    sede != undefined ? res.send(JSON.stringify(sedes)) : res.send("{}");
  } catch (error: any) {
    console.error(error);
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
  }
}

export { getAll, createOne };
