import { Request, Response } from "express";
import sequelize from "../database/connection";
import { ModelCtor } from "sequelize";
import { ISedeModel } from "../database/models/Sede";
import { IUbicationModel } from "../database/models/Ubicacion";
import ISedeUpdateDto from "../dto/sedes/update.dto";
import ISedeCreateDto from "../dto/sedes/create.dto";
import { IUsuarioSedesModel } from "../database/models/UsuarioSedes";
import IUsuarioSedeDto from "../dto/usuario-sedes/create.dto";

const sedesModel = sequelize.model('sedes') as ModelCtor<ISedeModel>
const ubicacionModel = sequelize.model('ubicacion') as ModelCtor<IUbicationModel>
const usuarioSedeModel = sequelize.model('usuario_sedes') as ModelCtor<IUsuarioSedesModel>

async function getAll(req: Request, res: Response) {
  const transaction = await sequelize.transaction()
  try {
    const tmpSedes = await sedesModel.findAll({ transaction });
    await transaction.commit()
    res.send(tmpSedes)
  } catch (error: any) {
    console.error(error);
    await transaction.rollback()
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
  }
}

async function createOne(req: Request, res: Response) {
  const { nombre, ubicacion } = req.body as ISedeCreateDto
  const transaction = await sequelize.transaction()
  try {

    const tmpUbicacion = await ubicacionModel.create({
      departamento: ubicacion.departamento,
      municipio: ubicacion.municipio,
      direccion: ubicacion.direccion,
      codigoPostal: ubicacion.codigoPostal
    }, { transaction })

    const tmpSede = await sedesModel.create({
      nombre,
      ubicacionId: tmpUbicacion.id
    }, { transaction });

    await transaction.commit()
    res.send(tmpSede)
  } catch (error: any) {
    console.error(error);
    await transaction.rollback()
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
  }
}

const updateOne = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction()
  const { nombre, ubicacion, id } = req.body as ISedeUpdateDto
  try {

    const tmpSede = await sedesModel.findByPk(id, {
      include: {
        model: ubicacionModel
      }, transaction
    })

    if (tmpSede) {
      tmpSede.nombre = nombre

      if (tmpSede.ubicacion) {
        tmpSede.ubicacion.departamento = ubicacion.departamento
        tmpSede.ubicacion.municipio = ubicacion.municipio
        tmpSede.ubicacion.direccion = ubicacion.direccion
        tmpSede.ubicacion.codigoPostal = ubicacion.codigoPostal
      }

      await tmpSede.save({ transaction })
    }

    await transaction.commit()
    res.send(tmpSede)
  } catch (error) {
    await transaction.rollback()
    console.log(error);
    res.send(error)
  }
}

const assignSede = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction()
  const { sedeId, usuarioId } = req.body as IUsuarioSedeDto
  try {

    const tmpUsuarioSede = await usuarioSedeModel.create({
      usuarioId: usuarioId,
      sedeId: sedeId
    }, { transaction })

    await transaction.commit()

    res.send(tmpUsuarioSede)
  } catch (error) {
    await transaction.rollback()
    res.send(error)
  }
}

export { getAll, createOne, updateOne, assignSede };