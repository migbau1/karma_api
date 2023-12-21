import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize, UUID } from "sequelize";
import { IUserModel } from "./Usuarios";
import { ISedeModel } from "./Sede";


interface IUsuarioSedesModel extends Model<InferAttributes<IUsuarioSedesModel>, InferCreationAttributes<IUsuarioSedesModel>> {
    usuarioId: string
    sedeId: string
    createdAt?: Date
    updatedAt?: Date
}

const usuarioSedesModelDefiner = (sequelize: Sequelize) => {
    sequelize.define<IUsuarioSedesModel>('usuario_sedes', {
        usuarioId: {
            type: UUID,
            primaryKey: true,
            references: {
                model: 'usuarios',
                key: 'id'
            },
            field: 'usuario_id'
        },
        sedeId: {
            type: UUID,
            primaryKey: true,
            references: {
                model: 'sedes',
                key: 'id'
            },
            field: 'sede_id'
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    })
}

export {
    IUsuarioSedesModel,
    usuarioSedesModelDefiner
}