import { FindOptions, InferAttributes, ModelCtor } from 'sequelize';
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
      codigoPostal: origen.cod_postal
    }, { transaction })

    const tmpDestino = await ubicacionModel.create({
      departamento: destino.departamento,
      municipio: destino.municipio,
      direccion: destino.direccion,
      codigoPostal: destino.cod_postal
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

const findAll = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction()
  const options: FindOptions<InferAttributes<IEncomiendaModel, { omit: never; }>> = {
    attributes: ['id', 'descripcion'],
    include: [
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
    ],
  }
  try {

    const tmpEnconmiendas = await encomiendaModel.findAll(options)

    await transaction.commit()
    res.send(tmpEnconmiendas)
  } catch (error) {

    console.log(error);
    await transaction.rollback()
    res.send(error)
  }
}

export {
  createOne,
  findAll
};
