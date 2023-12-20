import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { IUbicationModel } from "./Ubicacion";


interface ISedeModel extends Model<InferAttributes<ISedeModel>, InferCreationAttributes<ISedeModel>> {
  id?: CreationOptional<string>
  nombre: string
  ubicacionId: string
  ubicacion?: IUbicationModel
  createdAt?: Date
  updatedAt?: Date
}

const sedeModelDefiner = (sequelize: Sequelize) => {
  sequelize.define<ISedeModel>('sedes', {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    nombre: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    ubicacionId: {
      type: DataTypes.UUID,
      references: {
        model: {
          tableName: 'ubicacion'
        },
        key: "id",
      },
      field: 'ubicacion_id'
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  })
}

export {
  ISedeModel,
  sedeModelDefiner
}
