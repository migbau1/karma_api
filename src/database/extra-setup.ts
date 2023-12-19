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
    sede,
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
    ['sede']: ModelCtor<ISedeModel>,
    ['credenciales']: ModelCtor<ICredencialesModel>,
    ['roles']: ModelCtor<IRolesModel>,
    ['registro_encomiendas']: ModelCtor<IRegistroModel>,
    ['facturacion']: ModelCtor<IFacturacionModel>,
    ['usuario_sedes']: ModelCtor<IUsuarioSedesModel>
  }

  roles.hasOne(usuarios)
  usuarios.belongsTo(roles)

  ubicacion.hasOne(usuarios)
  usuarios.belongsToMany(ubicacion, { through: { model: usuarios }, foreignKey: 'id' })

  credenciales.hasOne(usuarios, { foreignKey: 'credencial_id' })
  usuarios.belongsTo(credenciales, { foreignKey: 'credencial_id' })

}

export default applyExtraSetup
