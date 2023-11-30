import { CreationOptional, InferAttributes, InferCreationAttributes, Model, Sequelize, UUIDV4, UUID, DataTypes } from "sequelize"

interface IUserModel extends Model<InferAttributes<IUserModel>, InferCreationAttributes<IUserModel>> {
    id: CreationOptional<string>
    nombre: string
    apellido: string
    cedula: number
    telefono: string
    rol: string
}

const userModelDefiner = (sequelize: Sequelize) => {
    sequelize.define<IUserModel>('usuario', {
        id: {
            allowNull: false,
            defaultValue: UUIDV4,
            primaryKey: true,
            type: UUID,
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
        rol: {
            type: DataTypes.ENUM({
                values: ["remitente", "destinatario", "empleado"],
            }),
        },
    })
}
export {
    IUserModel,
    userModelDefiner
}