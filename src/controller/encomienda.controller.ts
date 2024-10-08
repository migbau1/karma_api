import { FindOptions, Includeable, InferAttributes, ModelCtor, Op, WhereOptions, col, fn, where } from 'sequelize';
import sequelize from '../database/connection'
import { IEncomiendaModel } from '../database/models/Encomienda';
import { Request, Response } from 'express';
import IEncomiendaCreateDto from '../dto/encomienda/create.dto';
import { IUserModel } from '../database/models/Usuarios';
import Roles from '../utils/roles/roles.pointer';
import { IUbicationModel } from '../database/models/Ubicacion';
import { IProductoModel } from '../database/models/Producto';
import { IRegistroModel } from '../database/models/Registro';
import { IFacturacionModel } from '../database/models/Facturacion';
import IEncomiendaUpdateDto from '../dto/encomienda/update.dto';
import dayjs, { Dayjs } from 'dayjs';

const encomiendaModel = sequelize.model('encomiendas') as ModelCtor<IEncomiendaModel>
const usuarioModel = sequelize.model('usuarios') as ModelCtor<IUserModel>
const ubicacionModel = sequelize.model('ubicacion') as ModelCtor<IUbicationModel>
const productoModel = sequelize.model('productos') as ModelCtor<IProductoModel>
const registroModel = sequelize.model('registro_encomiendas') as ModelCtor<IRegistroModel>
const facturacionModel = sequelize.model('facturacion') as ModelCtor<IFacturacionModel>

const mapModels = [
  {
    name: 'usuarios',
    model: usuarioModel
  },
  {
    name: 'ubicacion',
    model: ubicacionModel
  },
  {
    name: 'productos',
    model: productoModel
  },
  {
    name: 'registro_encomiendas',
    model: registroModel
  },
  {
    name: 'facturacion',
    model: facturacionModel
  },
]

const createOne = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction()
  try {
    const { remitente,
      destinatario,
      origen,
      destino,
      producto,
      facturacion,
      descripcion } = req.body as IEncomiendaCreateDto

    const [tmpRemitente, createdRemitente] = await usuarioModel.findOrCreate({
      where: {
        cedula: remitente.cedula
      },
      defaults: {
        nombre: remitente.nombre,
        apellido: remitente.apellido,
        cedula: remitente.cedula,
        telefono: remitente.telefono,
        roleId: Roles.cliente
      }, transaction
    })

    if (!createdRemitente) {
      await tmpRemitente.update({
        nombre: remitente.nombre,
        apellido: remitente.apellido,
        telefono: remitente.telefono,
        roleId: tmpRemitente.roleId || Roles.cliente
      }, { transaction });
    }

    const [tmpDestinatario, createdDestinatario] = await usuarioModel.findOrCreate({
      where: {
        cedula: destinatario.cedula
      },
      defaults: {
        nombre: destinatario.nombre,
        apellido: destinatario.apellido,
        cedula: destinatario.cedula,
        telefono: destinatario.telefono,
        roleId: Roles.cliente
      }, transaction
    })

    if (!createdDestinatario) {
      await tmpDestinatario.update({
        nombre: destinatario.nombre,
        apellido: destinatario.apellido,
        telefono: destinatario.telefono,
        roleId: tmpRemitente.roleId || Roles.cliente
      }, { transaction });
    }

    const tmpOrigen = await ubicacionModel.create({
      departamento: origen.departamento,
      municipio: origen.municipio,
      direccion: origen.direccion,
      codigoPostal: origen.codigoPostal
    }, { transaction })

    const tmpDestino = await ubicacionModel.create({
      departamento: destino.departamento,
      municipio: destino.municipio,
      direccion: destino.direccion,
      codigoPostal: destino.codigoPostal
    }, { transaction })

    const tmpProducto = await productoModel.create({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      tipoProducto: producto.tipo_producto,
      cantidad: producto.cantidad,
      peso: producto.peso,
      pesoCob: producto.pesoCob,
      pesoVol: producto.pesoVol,
      valorDeclarado: producto.valorDeclarado
    }, { transaction })

    const tmpRegistro = await registroModel.create({
      sedeId: req.user?.sedeId!,
      usuarioId: req.user!.id!
    }, { transaction })

    const tmpEncomienda = await encomiendaModel.create({
      remitente_id: tmpRemitente.getDataValue('id')!,
      destinatario_id: tmpDestinatario.getDataValue('id')!,
      origen_id: tmpOrigen.getDataValue('id')!,
      destino_id: tmpDestino.getDataValue('id')!,
      producto_id: tmpProducto.id,
      registro_encomiendas: tmpRegistro.id,
      descripcion
    }, { transaction })

    const tmpFacturacion = await facturacionModel.create({
      encomiendaId: tmpEncomienda.id,
      valorSeguro: facturacion.valorSeguro,
      valorFlete: facturacion.valorFlete,
      otrosCobros: facturacion.otrosCobros,
      recargos: facturacion.recargos,
      descuentos: facturacion.descuentos,
      modoDePago: facturacion.modoDePago
    }, { transaction })

    await transaction.commit()
    res.send(tmpFacturacion.get())
  } catch (error: any) {
    await transaction.rollback()
    res.status(500).send(error)
  }
}

const updateOne = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction()
  const body = req.body as IEncomiendaUpdateDto
  try {
    const tmpEncomienda = await encomiendaModel.findByPk(body.id, { include: [...defaultIncludes()], transaction })

    if (tmpEncomienda) {
      const { remitente, destinatario, origen, destino, producto, facturacion } = tmpEncomienda
      tmpEncomienda.descripcion = body.descripcion

      if (remitente)
        remitente.nombre = body.remitente.nombre,
          remitente.apellido = body.remitente.apellido,
          remitente.cedula = body.remitente.cedula,
          remitente.telefono = body.remitente.telefono,
          await remitente.save({ transaction })

      if (destinatario)
        destinatario.nombre = body.destinatario.nombre,
          destinatario.apellido = body.destinatario.apellido,
          destinatario.cedula = body.destinatario.cedula,
          destinatario.telefono = body.destinatario.telefono,
          await destinatario.save({ transaction })

      if (origen)
        origen.departamento = body.origen.departamento,
          origen.municipio = body.origen.municipio,
          origen.direccion = body.origen.direccion,
          origen.codigoPostal = body.origen.codigoPostal,
          await origen.save({ transaction })

      if (destino)
        destino.departamento = body.destino.departamento,
          destino.municipio = body.destino.municipio,
          destino.direccion = body.destino.direccion,
          destino.codigoPostal = body.destino.codigoPostal,
          await destino.save({ transaction })

      if (producto)
        producto.nombre = body.producto.nombre,
          producto.descripcion = body.producto.descripcion,
          producto.tipoProducto = body.producto.tipo_producto,
          producto.peso = body.producto.peso,
          producto.cantidad = body.producto.cantidad,
          producto.pesoCob = body.producto.pesoCob,
          producto.pesoVol = body.producto.pesoVol,
          producto.valorDeclarado = body.producto.valorDeclarado,
          await producto.save({ transaction })

      if (facturacion)
        facturacion.valorSeguro = body.facturacion.valorSeguro,
          facturacion.valorFlete = body.facturacion.valorFlete,
          facturacion.otrosCobros = body.facturacion.otrosCobros,
          facturacion.recargos = body.facturacion.recargos,
          facturacion.descuentos = body.facturacion.descuentos,
          facturacion.modoDePago = body.facturacion.modoDePago,
          await facturacion.save({ transaction })


      await tmpEncomienda.save({ transaction })
    }

    await transaction.commit()

    res.send(tmpEncomienda)
  } catch (error) {
    await transaction.rollback()
    console.log(error);

    res.status(500).send(error)
  }
}

const findAll = async (req: Request, res: Response) => {
  const {
    includes,
    limit = 5,
    offset = 0,
    origenDepartamento,
    origenMunicipio,
    destinoDepartamento,
    destinoMunicipio,
    search,
    dateRange,
    order
  } = req.query
  const transaction = await sequelize.transaction()
  let options: FindOptions<InferAttributes<IEncomiendaModel, { omit: never; }>> = {
    attributes: ['id', 'descripcion', 'createdAt'],
    include: [
      ...defaultIncludes()
    ],
  }
  let tmpWhere: WhereOptions<InferAttributes<IEncomiendaModel, { omit: never; }>> = {}

  try {
    options.transaction = transaction

    if (limit && offset) {
      options.limit = parseInt(limit as string)
      options.offset = parseInt(offset as string)
    }

    if (includes) {
      options.include = [...defaultIncludes(), ...addIncludes(includes as string[])]
    }

    if (origenDepartamento) {
      tmpWhere["$origen.departamento$"] = origenDepartamento
    }

    if (origenMunicipio) {
      tmpWhere["$origen.municipio$"] = origenMunicipio
    }

    if (destinoDepartamento) {
      tmpWhere["$destino.departamento$"] = destinoDepartamento
    }

    if (destinoMunicipio) {
      tmpWhere["$destino.municipio$"] = destinoMunicipio
    }

    if (dateRange) {
      const tmpDates = dateRange as string[]

      tmpWhere["createdAt"] = {
        [Op.between]: [tmpDates[0], tmpDates[1]]
      }
    }

    if (order) {
      options.order = [['createdAt', order as string]]
    }

    const findId = !!Number(search) && Number(search)


    if (search) {

      if (findId) {
        tmpWhere.id = findId
      } else {
        tmpWhere = {
          ...tmpWhere,
          [Op.or]: [
            where(fn("concat", col("remitente.nombre"), ' ', col("remitente.apellido")), {
              [Op.like]: `%${search}%`
            }),
            where(fn("concat", col("destinatario.nombre"), ' ', col("destinatario.apellido")), {
              [Op.like]: `%${search}%`
            }),
            {
              ["$remitente.nombre$"]: {
                [Op.like]: `%${search}%`
              }
            },
            {
              ["$remitente.apellido$"]: {
                [Op.like]: `%${search}%`
              }
            },
            {
              ["$origen.departamento$"]: {
                [Op.like]: `%${search}%`
              }
            },
            {
              ["$origen.municipio$"]: {
                [Op.like]: `%${search}%`
              }
            },
            {
              ["$destino.departamento$"]: {
                [Op.like]: `%${search}%`
              }
            },
            {
              ["$destino.municipio$"]: {
                [Op.like]: `%${search}%`
              }
            },
          ]
        } as typeof tmpWhere
      }
    }

    options.where = tmpWhere
    const tmpEnconmiendas = await encomiendaModel.findAndCountAll(options)

    await transaction.commit()
    res.send(tmpEnconmiendas)
  } catch (error: any) {
    console.log(error);

    await transaction.rollback()
    res.status(500).send(error);
  }
}

const findOne = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction()
  const options: FindOptions<InferAttributes<IEncomiendaModel, { omit: never; }>> = {
    attributes: ['id', 'descripcion'],
    include: [
      ...defaultIncludes(),
    ],
  }
  const param = req.params.id
  try {
    options.transaction = transaction
    const tmpEnconmiendas = await encomiendaModel.findByPk(param, options)

    if (!tmpEnconmiendas) {
      return res.status(404).json({
        message: 'Not Found'
      })
    }

    await transaction.commit()
    res.send(tmpEnconmiendas)
  } catch (error) {
    console.log(error);
    await transaction.rollback()
    res.send(error)
  }
}

const defaultIncludes = (): Includeable[] => {
  return [
    {
      model: usuarioModel,
      as: 'remitente',
    },
    {
      model: usuarioModel,
      as: 'destinatario',
    },
    {
      model: ubicacionModel,
      as: 'origen',
    },
    {
      model: ubicacionModel,
      as: 'destino',
    },
    {
      model: productoModel,
      as: 'producto'
    },
    {
      model: facturacionModel,
      as: 'facturacion'
    }
  ]
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
  createOne,
  updateOne,
  findAll,
  findOne,
  defaultIncludes
};
