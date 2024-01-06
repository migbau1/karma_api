import { FindOptions, Includeable, InferAttributes, ModelCtor, Op } from 'sequelize'
import sequelize from '../database/connection'
import { Request, RequestHandler, Response } from 'express';
import { IUserModel } from '../database/models/Usuarios';
import { IUbicationModel } from '../database/models/Ubicacion';
import Roles from '../utils/roles/roles.pointer';
import IUpdateUserDto from '../dto/user/update.dto';
import IUserCreateDto from '../dto/user/create.dto';
import ICustomerParams from '../dto/user/query.params';

const usuarios = sequelize.model('usuarios') as ModelCtor<IUserModel>
const ubicaciones = sequelize.model('ubicacion') as ModelCtor<IUbicationModel>

const mapModels = [
  {
    name: 'ubicacion',
    model: ubicaciones
  }
]

async function createOne(req: Request, res: Response) {
  const { nombre, apellido, cedula, telefono, rol, ubicacion } = req.body as IUserCreateDto;
  const t = await sequelize.transaction();
  let tmpUser = null;
  let tmpUbicacion = null;
  try {
    if (ubicacion) {
      tmpUbicacion = await ubicaciones.create({
        departamento: ubicacion.departamento,
        municipio: ubicacion.municipio,
        direccion: ubicacion.direccion,
        codigoPostal: ubicacion.cod_postal
      }, {
        transaction: t,
      });
    }

    tmpUser = await usuarios.create(
      {
        nombre,
        apellido,
        cedula,
        telefono,
        ubicacionId: tmpUbicacion?.id,
        roleId: rol || Roles.cliente,
      },
      { transaction: t }
    );

    await t.commit();
    tmpUser != undefined ? res.send(tmpUser) : res.send({});
  } catch (error: any) {
    await t.rollback();
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
  }
}

const updateOne = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  const { id, ubicacion, nombre, apellido, cedula, telefono, rol } = req.body as IUpdateUserDto;
  try {

    const tmpUser = await usuarios.findByPk(id, {
      include: {
        model: ubicaciones,
      },
      transaction: t
    })

    if (tmpUser) {
      tmpUser.nombre = nombre;
      tmpUser.apellido = apellido;
      tmpUser.cedula = cedula;
      tmpUser.telefono = telefono;
      tmpUser.roleId = rol;
      if (tmpUser.ubicacion && ubicacion) {
        tmpUser.ubicacion.departamento = ubicacion?.departamento
        tmpUser.ubicacion.municipio = ubicacion?.municipio
        tmpUser.ubicacion.direccion = ubicacion?.direccion
        tmpUser.ubicacion.codigoPostal = ubicacion?.cod_postal
        await tmpUser.ubicacion.save()
      } else if (ubicacion) {
        const tmpUbicacion = await ubicaciones.create({
          departamento: ubicacion.departamento,
          municipio: ubicacion.municipio,
          direccion: ubicacion.direccion,
          codigoPostal: ubicacion.cod_postal
        }, { transaction: t })

        tmpUser.ubicacion = tmpUbicacion
      }
      await tmpUser.save()
    }


    await t.commit();
    res.send(tmpUser)
  } catch (error: any) {
    console.error(error);
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
    await t.rollback();
  }
}

const findAll = async (
  req: Request,
  res: Response
) => {
  const t = await sequelize.transaction()
  const { includes, widthAdmins = false, limit = 5, offset = 0 } = req.query
  let options: FindOptions<InferAttributes<IUserModel, { omit: never; }>> | undefined = {}
  options.subQuery = false

  try {
    options.transaction = t

    if (limit && offset) {
      options.limit = parseInt(limit as string)
      options.offset = parseInt(offset as string)
    }

    options.where = {
      roleId: {
        [Op.notIn]: [!widthAdmins && Roles.admin]
      },
    }

    if (includes) {
      options.include = addIncludes(includes as string[])
    }

    const tmpUsuarios = await usuarios.findAndCountAll({
      ...options
    })

    await t.commit()

    res.send(tmpUsuarios)
  } catch (error) {
    await t.rollback();
    res.send(error);
  }
}

const findOne = async (req: Request, res: Response) => {
  const t = await sequelize.transaction()
  let options: FindOptions<InferAttributes<IUserModel, { omit: never; }>> | undefined = {
    include: {
      model: ubicaciones
    }
  }
  try {
    const tmpUsuario = await usuarios.findByPk(req.params.id, options)
    res.send(tmpUsuario)
  } catch (error) {
    await t.rollback();
    res.send(error);
  }
}

const addIncludes = (includes: Array<string>): Includeable[] => {

  const models = includes.map((nameModel) => (
    mapModels.find(({ name }) => name === nameModel)?.model
  ))

  const tmpIncludes: Includeable[] = models.map((model) => (
    {
      model,
    }
  ))

  return tmpIncludes
}


export {
  findOne,
  findAll,
  createOne,
  updateOne
};
