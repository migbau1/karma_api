import { Sequelize } from "sequelize";

import { ubicationModelDefiner } from './models/Ubicacion'
import { productoModelDefiner } from "./models/Producto";
import { sedeModelDefiner } from "./models/Sede";
import { userModelDefiner } from "./models/User";
import { encomiendaModelDefiner } from "./models/Encomienda";
import { credentialsModelDefiner } from "./models/Credentials";

import applyExtraSetup from "./extra-setup";

const sequelize: Sequelize = new Sequelize({
  dialect: "mysql",
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 3306,
  define: {
    // timestamps: false, // I do not want timestamp fields by default
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
  credentialsModelDefiner
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

applyExtraSetup(sequelize);

export default sequelize;
