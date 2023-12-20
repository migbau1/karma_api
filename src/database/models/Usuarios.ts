import { CreationOptional, InferAttributes, InferCreationAttributes, Model, Sequelize, UUIDV4, UUID, DataTypes } from "sequelize"
import { IUbicationModel } from "./Ubicacion"

interface IUserModel extends Model<InferAttributes<IUserModel>, InferCreationAttributes<IUserModel>> {
    id?: CreationOptional<string>
    nombre: string
    apellido: string
    cedula: string
    telefono?: string
    roleId?: string
    ubicacionId?: string
    credencialId?: string
    createdAt?: Date
    updatedAt?: Date
    ubicacion?: IUbicationModel
}

const userModelDefiner = (sequelize: Sequelize) => {
    sequelize.define<IUserModel>('usuarios', {
        id: {
            type: UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: UUIDV4,
        },
        nombre: {
            allowNull: false,
            type: DataTypes.STRING(50),
        },
        apellido: {
            allowNull: false,
            type: DataTypes.STRING(50),
        },
        cedula: {
            allowNull: false,
            type: DataTypes.STRING(50),
            unique: true,
        },
        telefono: {
            type: DataTypes.TEXT,
        },
        roleId: {
            type: UUID,
            references: {
                model: {
                    tableName: 'roles'
                },
                key: 'id',
            },
            field: 'rol_id'
        },
        ubicacionId: {
            type: UUID,
            references: {
                model: {
                    tableName: 'ubicacion'
                },
                key: 'id'
            },
            field: 'ubicacion_id'
        },
        credencialId: {
            type: UUID,
            references: {
                model: {
                    tableName: 'credenciales'
                },
                key: 'id'
            },
            field: 'credencial_id'
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
        { freezeTableName: true }
    )
}
export {
    IUserModel,
    userModelDefiner
}