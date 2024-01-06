import { CreationOptional, DataTypes, INTEGER, InferAttributes, InferCreationAttributes, Model, Sequelize, UUID, UUIDV4 } from "sequelize";
import { IEncomiendaModel } from "./Encomienda";


interface IFacturacionModel extends Model<InferAttributes<IFacturacionModel>, InferCreationAttributes<IFacturacionModel>> {
    id: CreationOptional<string>
    encomiendaId: number
    valorSeguro: number
    valorFlete: number
    otrosCobros: number
    recargos: number
    descuentos: number
    createdAt?: Date
    updatedAt?: Date
    encomienda?: IEncomiendaModel
}

const facturacionModelDefiner = (sequelize: Sequelize) => {
    sequelize.define<IFacturacionModel>('facturacion', {
        id: {
            type: UUID,
            primaryKey: true,
            defaultValue: UUIDV4
        },
        encomiendaId: {
            type: INTEGER,
            references: {
                model: 'encomiendas',
                key: 'id'
            },
            field: 'encomienda_id',
        },
        valorSeguro: {
            type: DataTypes.DOUBLE,
            field: 'valor_seguro'
        },
        valorFlete: {
            type: DataTypes.DOUBLE,
            field: 'valor_flete'
        },
        otrosCobros: {
            type: DataTypes.DOUBLE,
            field: 'otros_cobros'
        },
        recargos: {
            type: DataTypes.DOUBLE
        },
        descuentos: {
            type: DataTypes.DOUBLE
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    })
}

export {
    IFacturacionModel,
    facturacionModelDefiner
}