import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize, UUID, UUIDV4 } from "sequelize";
import { ISedeModel } from "./Sede";
import { IUserModel } from "./Usuarios";


interface IRegistroModel extends Model<InferAttributes<IRegistroModel>, InferCreationAttributes<IRegistroModel>> {
    id: CreationOptional<string>
    sedeId: string
    usuarioId: string
    createdAt?: Date
    updatedAt?: Date
}


const registroModelDefiner = (sequelize: Sequelize) => {
    sequelize.define<IRegistroModel>('registro_encomiendas', {
        id: {
            type: UUID,
            primaryKey: true,
            defaultValue: UUIDV4
        },
        sedeId: {
            type: UUID,
            references: {
                model: {
                    tableName: 'sedes'
                },
                key: 'id'
            },
            field: 'sede_id'
        },
        usuarioId: {
            type: UUID,
            references: {
                model: {
                    tableName: 'usuarios',
                },
                key: 'id'
            },
            field: 'usuario_id'
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    })
}

export {
    IRegistroModel,
    registroModelDefiner
}