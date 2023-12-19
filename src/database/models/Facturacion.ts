import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize, UUID, UUIDV4 } from "sequelize";
import { IEncomiendaModel } from "./Encomienda";


interface IFacturacionModel extends Model<InferAttributes<IFacturacionModel>, InferCreationAttributes<IFacturacionModel>> {
    id: CreationOptional<string>
    encomienda: IEncomiendaModel
    valorSeguro: number
    valorFlete: number
    otrosCobros: number
    recargos: number
    descuentos: number
    createdAt: Date
    updatedAt: Date
}

const facturacionModelDefiner = (sequelize: Sequelize) => {
    sequelize.define<IFacturacionModel>('facturacion', {
        id: {
            type: UUID,
            primaryKey: true,
            defaultValue: UUIDV4
        },
        encomienda: {
            type: UUID,
            references: {
                model: 'encomiendas',
                key: 'id'
            },
            field: 'encomienda_id',
        },
        valorSeguro: {
            type: DataTypes.DECIMAL(10, 3),
            field: 'valor_seguro',
        },
        valorFlete: {
            type: DataTypes.DECIMAL(10, 3),
            field: 'valor_flete',
        },
        otrosCobros: {
            type: DataTypes.DECIMAL(10, 3),
            field: 'otros_cobros',
        },
        recargos: {
            type: DataTypes.DECIMAL(10, 3),
        },
        descuentos: DataTypes.DECIMAL(10, 3),
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    })
}

export {
    IFacturacionModel,
    facturacionModelDefiner
}