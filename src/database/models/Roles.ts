import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, STRING, Sequelize, UUID, UUIDV4 } from "sequelize";


interface IRolesModel extends Model<InferAttributes<IRolesModel>, InferCreationAttributes<IRolesModel>> {
    id: CreationOptional<string>
    name: string
    createdAt: Date
    updatedAt: Date
}

const rolesModelDefiner = (sequelize: Sequelize) => {
    sequelize.define<IRolesModel>('roles', {
        id: {
            type: UUID,
            allowNull: false,
            defaultValue: UUIDV4,
            primaryKey: true,
        },
        name: {
            type: STRING,
        },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    })
}

export {
    IRolesModel,
    rolesModelDefiner
}