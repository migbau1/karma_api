import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

interface IProductoModel extends Model<InferAttributes<IProductoModel>, InferCreationAttributes<IProductoModel>> {
  id: CreationOptional<string>
  nombre: string
  descripcion: string
  tipoProducto: string
  cantidad: number
  peso: number
  pesoCob: number
  pesoVol: number
  valorDeclarado: number
  createdAt?: Date
  updatedAt?: Date
}

const productoModelDefiner = (sequelize: Sequelize) => {
  sequelize.define<IProductoModel>("productos", {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    nombre: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tipoProducto: {
      type: DataTypes.STRING,
      field: 'tipo_producto',
    },
    peso: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    pesoCob: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      field: 'peso_cobrar',
    },
    pesoVol: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      field: 'peso_vol',
    },
    valorDeclarado: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      field: 'valor_declarado',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  });
};

export {
  IProductoModel,
  productoModelDefiner
}