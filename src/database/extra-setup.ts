import { Model, ModelCtor, Sequelize } from "sequelize";
import { IUserModel } from "./models/Usuarios";
import { IUbicationModel } from "./models/Ubicacion";
import { IProductoModel } from "./models/Producto";
import { IEncomiendaModel } from "./models/Encomienda";
import { ISedeModel } from "./models/Sede";
import { ICredencialesModel } from "./models/Credenciales";
import { IRolesModel } from "./models/Roles";
import { IRegistroModel } from "./models/Registro";
import { IFacturacionModel } from "./models/Facturacion";
import { IUsuarioSedesModel } from "./models/UsuarioSedes";

function applyExtraSetup(sequelize: Sequelize): void {

  const {
    usuarios,
    ubicacion,
    productos,
    encomiendas,
    sedes,
    credenciales,
    roles,
    registro_encomiendas,
    facturacion,
    usuario_sedes
  } = sequelize.models as {
    ['usuarios']: ModelCtor<IUserModel>,
    ['ubicacion']: ModelCtor<IUbicationModel>,
    ['productos']: ModelCtor<IProductoModel>,
    ['encomiendas']: ModelCtor<IEncomiendaModel>,
    ['sedes']: ModelCtor<ISedeModel>,
    ['credenciales']: ModelCtor<ICredencialesModel>,
    ['roles']: ModelCtor<IRolesModel>,
    ['registro_encomiendas']: ModelCtor<IRegistroModel>,
    ['facturacion']: ModelCtor<IFacturacionModel>,
    ['usuario_sedes']: ModelCtor<IUsuarioSedesModel>
  }

  roles.hasOne(usuarios)
  usuarios.belongsTo(roles)

  ubicacion.hasOne(usuarios)
  usuarios.belongsTo(ubicacion)

  credenciales.hasOne(usuarios, { foreignKey: 'credencial_id' })
  usuarios.belongsTo(credenciales, { foreignKey: 'credencial_id' })

  ubicacion.hasOne(sedes)
  sedes.belongsTo(ubicacion)

  usuarios.belongsToMany(sedes, { through: 'usuario_sedes' })
  sedes.belongsToMany(usuarios, { through: 'usuario_sedes' })

  usuarios.hasMany(encomiendas, {
    as: 'remitente',
    foreignKey: {
      name: "remitente_id",
      allowNull: false
    }
  })
  usuarios.hasMany(encomiendas, {
    as: 'destinatario',
    foreignKey: {
      name: "destinatario_id",
      allowNull: false
    }
  })

  encomiendas.belongsTo(usuarios, {
    as: 'remitente',
    foreignKey: {
      name: "remitente_id",
      allowNull: false
    }
  })

  encomiendas.belongsTo(usuarios, {
    as: 'destinatario',
    foreignKey: {
      name: "destinatario_id",
      allowNull: false
    }
  })



  ubicacion.hasMany(encomiendas, {
    as: 'origen',
    foreignKey: {
      name: "origen_id",
      allowNull: false
    }
  })
  ubicacion.hasMany(encomiendas, {
    as: 'destino',
    foreignKey: {
      name: "destino_id",
      allowNull: false
    }
  })

  encomiendas.belongsTo(ubicacion, {
    as: 'origen',
    foreignKey: {
      name: "origen_id",
      allowNull: false
    }
  })

  encomiendas.belongsTo(ubicacion, {
    as: 'destino',
    foreignKey: {
      name: "destino_id",
      allowNull: false
    }
  })

  productos.hasOne(encomiendas)
  encomiendas.belongsTo(productos)

  usuarios.hasMany(registro_encomiendas)
  sedes.hasOne(registro_encomiendas)

  registro_encomiendas.belongsTo(usuarios)
  registro_encomiendas.belongsTo(sedes)
}

export default applyExtraSetup
