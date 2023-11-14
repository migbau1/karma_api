require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./database/connection");
const passport = require("passport");
const session = require("express-session");

const app = express();

const user = require("./router/user.router");
const encomienda = require("./router/encomienda.router");
const sede = require("./router/sede.router");
const login = require("./router/login.route");
const docs = require("./router/generatedocument");

const corsOptions = {
  origin: [
    "http://localhost:8081",
    "http://anditransas.com",
    "http://217.21.78.153",
    "https://anditransas.com",
    "http://www.anditransas.com",
    "https://www.anditransas.com",
    "http://localhost:8081/*",
    "http://localhost:8081/login",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(require("flash")());
app.use(passport.initialize());
app.use(passport.session());

require("./auth/config.passport")(passport);

app.use("/user", user);
app.use("/api/login", login);
app.use("/encomienda", encomienda);
app.use("/sede", sede);
app.use("/api/docs", docs);


async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.authenticate();
    // await sequelize.sync({ alter: true });
    console.log("Database connection OK!");
  } catch (error) {
    console.log("Unable to connect to the database:");
    console.log(error.message);
    process.exit(1);
  }
}

async function init() {
  try {
    await assertDatabaseConnectionOk();
  } catch (error) {
    console.log(error);
  }

  app.listen(process.env.PORT, () => {
    console.log(
      `Express server started on port ${process.env.PORT}. http://localhost:${process.env.PORT}.`
    );
  });
}

init();
