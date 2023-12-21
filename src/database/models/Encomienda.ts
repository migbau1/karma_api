import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize, UUID, UUIDV4 } from "sequelize";
import { IUbicationModel } from "./Ubicacion";
import { IUserModel } from "./Usuarios";
import { IProductoModel } from "./Producto";
import { IRegistroModel } from "./Registro";
import { IFacturacionModel } from "./Facturacion";
import { ISedeModel } from "./Sede";

interface IEncomiendaModel extends Model<InferAttributes<IEncomiendaModel>, InferCreationAttributes<IEncomiendaModel>> {
  id: CreationOptional<string>
  remitente_id: string
  destinatario_id: string
  origen_id: string
  destino_id: string
  producto_id: string
  descripcion?: string
  registro_encomiendas: string
  createdAt?: Date
  updatedAt?: Date

  remitente?: IUserModel
  destinatario?: IUserModel
  origen?: IUbicationModel
  destino?: IUbicationModel
  producto?: IProductoModel
  registro?: IRegistroModel
  facturacion?: IFacturacionModel
  sede?: ISedeModel
}


const encomiendaModelDefiner = (sequelize: Sequelize) => {
  sequelize.define<IEncomiendaModel>("encomiendas", {
    id: {
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    remitente_id: {
      type: DataTypes.UUID,
      references: {
        model: "usuarios",
        key: "id",
      },
      field: 'remitente_id'
    },
    destinatario_id: {
      type: DataTypes.UUID,
      references: {
        model: "usuarios",
        key: "id",
      },
      field: 'destinatario_id'
    },
    origen_id: {
      type: DataTypes.UUID,
      references: {
        model: "ubicacion",
        key: "id",
      },
      field: 'origen_id'
    },
    destino_id: {
      type: DataTypes.UUID,
      references: {
        model: "ubicacion",
        key: "id",
      },
      field: 'destino_id'
    },
    producto_id: {
      type: DataTypes.UUID,
      references: {
        model: "productos",
        key: "id",
      },
      field: 'producto_id'
    },
    descripcion: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    registro_encomiendas: {
      type: UUID,
      references: {
        model: {
          tableName: 'registro_encomiendas'
        },
        key: 'id'
      },
      field: 'registro_id'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'createdAt'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updatedAt'
    }
  }, {underscored: true});
};

export {
  IEncomiendaModel,
  encomiendaModelDefiner
}