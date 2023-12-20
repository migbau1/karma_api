import { InferAttributes, Model, InferCreationAttributes, Sequelize, UUID, UUIDV4, DataTypes, CreationOptional } from "sequelize";

interface IUbicationModel extends Model<InferAttributes<IUbicationModel>, InferCreationAttributes<IUbicationModel>> {
    id: CreationOptional<string>
    departamento: string
    municipio: string
    codigoPostal: string
    direccion: string
    createdAt?: Date
    updatedAt?: Date
}

const ubicationModelDefiner = (sequelize: Sequelize) => {
    sequelize.define<IUbicationModel>('ubicacion', {
        id: {
            primaryKey: true,
            type: UUID,
            allowNull: false,
            defaultValue: UUIDV4,
        },
        departamento: {
            allowNull: false,
            type: DataTypes.STRING,

        },
        municipio: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        codigoPostal: {
            allowNull: false,
            type: DataTypes.STRING,
            field: 'cod_postal'
        },
        direccion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, { freezeTableName: true, name: {
        singular: 'ubicacion',
        plural: 'ubicacion'
    } })
}

export {
    IUbicationModel,
    ubicationModelDefiner
}