import { Sequelize } from "sequelize";

import { ubicationModelDefiner } from './models/Ubicacion'
import { productoModelDefiner } from "./models/Producto";
import { sedeModelDefiner } from "./models/Sede";
import { userModelDefiner } from "./models/Usuarios";
import { encomiendaModelDefiner } from "./models/Encomienda";
import { credentialsModelDefiner } from "./models/Credenciales";

import applyExtraSetup from "./extra-setup";
import { rolesModelDefiner } from "./models/Roles";
import { registroModelDefiner } from "./models/Registro";
import { facturacionModelDefiner } from "./models/Facturacion";
import { usuarioSedesModelDefiner } from "./models/UsuarioSedes";

const sequelize: Sequelize = new Sequelize({
  dialect: "mysql",
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 3306,
  define: {
    // timestamps: false, // I do not want timestamp fields by default
    freezeTableName: true
  },
  dialectOptions: {
    supportBigNumbers: true,
    useUTC: false, //for reading from database
    dateStrings: true,
  },
  timezone: "-05:00",
}
);

const modelDefiners = [
  userModelDefiner,
  ubicationModelDefiner,
  productoModelDefiner,
  encomiendaModelDefiner,
  sedeModelDefiner,
  credentialsModelDefiner,
  rolesModelDefiner,
  registroModelDefiner,
  facturacionModelDefiner,
  usuarioSedesModelDefiner
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}
applyExtraSetup(sequelize);

export default sequelize;
