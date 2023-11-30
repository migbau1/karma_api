import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

interface IProductoModel extends Model<InferAttributes<IProductoModel>, InferCreationAttributes<IProductoModel>> {
  id: CreationOptional<string>
  nombre: string
  peso: number
  cantidad: number
  descripcion: string
  pesoCob: number
  pesoVol: number
  valorDeclarado: number
}

const productoModelDefiner = (sequelize: Sequelize) => {
  sequelize.define<IProductoModel>("producto", {
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
    peso: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pesoCob: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    pesoVol: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    valorDeclarado: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  });
};

export {
  IProductoModel,
  productoModelDefiner
}