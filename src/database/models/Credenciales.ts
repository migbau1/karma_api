import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize, UUID, UUIDV4 } from "sequelize";
import { IUserModel } from "./Usuarios";

interface ICredencialesModel extends Model<InferAttributes<ICredencialesModel>, InferCreationAttributes<ICredencialesModel>> {
  id: CreationOptional<string>
  email: string
  password: string
  createdAt?: Date
  updatedAt?: Date
  usuario?: IUserModel
}

const credentialsModelDefiner = (sequelize: Sequelize) => {
  const a = sequelize.define<ICredencialesModel>('credenciales',
    {
      id: {
        type: UUID,
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    }
  )
}

export {
  ICredencialesModel,
  credentialsModelDefiner
}