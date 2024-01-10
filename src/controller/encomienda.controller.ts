import { FindOptions, Includeable, InferAttributes, ModelCtor } from 'sequelize';
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

    const [tmpRemitente] = await usuarioModel.findOrCreate({
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

    const [tmpDestinatario] = await usuarioModel.findOrCreate({
      where: {
        cedula: destinatario.cedula
      },
      defaults: {
        nombre: destinatario.nombre,
        apellido: destinatario.apellido,
        cedula: destinatario.cedula,
        telefono: remitente.telefono,
        roleId: Roles.cliente
      }, transaction
    })

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
      pesoCob: producto.peso_cobrar,
      pesoVol: producto.peso_vol,
      valorDeclarado: producto.valor_declarado
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
    }, { transaction })

    await transaction.commit()
    res.send(tmpFacturacion.get())
  } catch (error) {
    console.log(error);
    await transaction.rollback()
    res.send(error)
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
          remitente.telefono = body.remitente.cedula,
          await remitente.save({ transaction })

      if (destinatario)
        destinatario.nombre = body.destinatario.nombre,
          destinatario.apellido = body.destinatario.apellido,
          destinatario.cedula = body.destinatario.cedula,
          destinatario.telefono = body.destinatario.cedula,
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
          producto.pesoCob = body.producto.peso_cobrar,
          producto.pesoVol = body.producto.peso_vol,
          producto.valorDeclarado = body.producto.valor_declarado,
          await producto.save({ transaction })

      if (facturacion)
        facturacion.valorSeguro = body.facturacion.valorSeguro,
          facturacion.valorFlete = body.facturacion.valorFlete,
          facturacion.otrosCobros = body.facturacion.otrosCobros,
          facturacion.recargos = body.facturacion.recargos,
          facturacion.descuentos = body.facturacion.descuentos,
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
  const { includes, limit = 5, offset = 0 } = req.query
  const transaction = await sequelize.transaction()
  let options: FindOptions<InferAttributes<IEncomiendaModel, { omit: never; }>> = {
    attributes: ['id', 'descripcion', 'createdAt'],
    include: [
      ...defaultIncludes()
    ],
  }

  try {

    if (limit && offset) {
      options.limit = parseInt(limit as string)
      options.offset = parseInt(offset as string)
    }

    if (includes) {
      options.include = [...defaultIncludes(), ...addIncludes(includes as string[])]
    }

    const tmpEnconmiendas = await encomiendaModel.findAndCountAll(options)

    await transaction.commit()
    res.send(tmpEnconmiendas)
  } catch (error) {

    console.log(error);
    await transaction.rollback()
    res.send(error)
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
