import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { IUbicationModel } from "./Ubicacion";
import { IUserModel } from "./User";
import { IProductoModel } from "./Producto";
import { ISedeModel } from "./Sede";

interface IEncomiendaModel extends Model<InferAttributes<IEncomiendaModel>, InferCreationAttributes<IEncomiendaModel>> {
  id: CreationOptional<string>
  remitenteId: IUserModel
  destinatarioId: IUserModel
  origenId: IUbicationModel
  destinoId: IUbicationModel
  productoId: IProductoModel
  descripcion: string
  sedeId: ISedeModel
  tipoProducto: string
  valorSeguro: number
  otrosCobros: number
  valorFlete: number
  recargos: number
  descuento: number
  formaPago: string
}


const encomiendaModelDefiner = (sequelize: Sequelize) => {
  sequelize.define<IEncomiendaModel>("encomienda", {
    id: {
      type: DataTypes.BIGINT(),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,

    },
    remitenteId: {
      type: DataTypes.UUID,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    destinatarioId: {
      type: DataTypes.UUID,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    origenId: {
      type: DataTypes.UUID,
      references: {
        model: "ubicacions",
        key: "id",
      },
    },
    destinoId: {
      type: DataTypes.UUID,
      references: {
        model: "ubicacions",
        key: "id",
      },
    },
    productoId: {
      type: DataTypes.UUID,
      references: {
        model: "productos",
        key: "id",
      },
    },
    descripcion: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    sedeId: {
      type: DataTypes.UUID,
      references: {
        model: "sedes",
        key: "id",
      },
    },
    tipoProducto: {
      allowNull: true,
      type: DataTypes.STRING(50),
    },
    valorSeguro: {
      allowNull: true,
      type: DataTypes.DOUBLE,
    },
    otrosCobros: {
      allowNull: true,
      type: DataTypes.DOUBLE,
    },
    valorFlete: {
      allowNull: true,
      type: DataTypes.DOUBLE,
    },
    recargos: {
      allowNull: true,
      type: DataTypes.DOUBLE,
    },
    descuento: {
      allowNull: true,
      type: DataTypes.DOUBLE,
    },
    formaPago: {
      allowNull: true,
      type: DataTypes.STRING,
    },
  });
};

export {
  IEncomiendaModel,
  encomiendaModelDefiner
}