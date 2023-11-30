import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { IUbicationModel } from "./Ubicacion";


interface ISedeModel extends Model<InferAttributes<ISedeModel>, InferCreationAttributes<ISedeModel>> {
  id: CreationOptional<string>
  nombre: string
  ubicacion: IUbicationModel
}

const sedeModelDefiner = (sequelize: Sequelize) => {
  sequelize.define<ISedeModel>('sede', {
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
    ubicacion: {
      type: DataTypes.UUID,
      references: {
        model: "ubicacion",
        key: "id",
      },
    },
  })
}

export {
  ISedeModel,
  sedeModelDefiner
}
