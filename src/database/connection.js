const { Sequelize } = require("sequelize");
const { applyExtraSetup } = require("./extra-setup");

const sequelize = new Sequelize({
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
});

const modelDefiners = [
  require("./models/Ubicacion"),
  require("./models/Producto"),
  require("./models/Encomienda"),
  require("./models/User"),
  require("./models/Sede"),
  require("./models/Credentials"),
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

applyExtraSetup(sequelize);

module.exports = sequelize;
