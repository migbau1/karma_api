import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize, UUID, UUIDV4 } from "sequelize";
import { IUbicationModel } from "./Ubicacion";
import { IUserModel } from "./Usuarios";
import { IProductoModel } from "./Producto";
import { ISedeModel } from "./Sede";
import { IRegistroModel } from "./Registro";

interface IEncomiendaModel extends Model<InferAttributes<IEncomiendaModel>, InferCreationAttributes<IEncomiendaModel>> {
  id: CreationOptional<string>
  remitenteId: IUserModel
  destinatarioId: IUserModel
  origenId: IUbicationModel
  destinoId: IUbicationModel
  productoId: IProductoModel
  descripcion?: string
  registro: IRegistroModel
  createdAt?: Date
  updatedAt?: Date
}


const encomiendaModelDefiner = (sequelize: Sequelize) => {
  sequelize.define<IEncomiendaModel>("encomiendas", {
    id: {
      type: UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    remitenteId: {
      type: DataTypes.UUID,
      references: {
        model: "usuarios",
        key: "id",
      },
      field: 'remitente_id'
    },
    destinatarioId: {
      type: DataTypes.UUID,
      references: {
        model: "usuarios",
        key: "id",
      },
      field: 'destinatario_id'
    },
    origenId: {
      type: DataTypes.UUID,
      references: {
        model: "ubicacion",
        key: "id",
      },
      field: 'origen_id'
    },
    destinoId: {
      type: DataTypes.UUID,
      references: {
        model: "ubicacion",
        key: "id",
      },
      field: 'destino_id'
    },
    productoId: {
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
    registro: {
      type: UUID,
      references: {
        model: {
          tableName: 'registro_encomiendas'
        },
        key: 'id'
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  });
};

export {
  IEncomiendaModel,
  encomiendaModelDefiner
}