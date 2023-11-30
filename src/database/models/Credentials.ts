import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize, UUID, UUIDV4 } from "sequelize";

interface ICredentialsModel extends Model<InferAttributes<ICredentialsModel>, InferCreationAttributes<ICredentialsModel>> {
  id: CreationOptional<string>
  email: string
  password: string
  name: string
}

const credentialsModelDefiner = (sequelize: Sequelize) => {
  sequelize.define<ICredentialsModel>('userCredentials',
    {
      id: {
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true,
        type: UUID,
      },
      email: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      password: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      name: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "userCredentials",
    }
  )
}

export {
  ICredentialsModel,
  credentialsModelDefiner
}