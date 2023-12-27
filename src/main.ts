import * as dotenv from 'dotenv'

dotenv.config();

import express, { Express } from 'express'

import sequelize from './database/connection'
import cors from 'cors'
import passport from 'passport'
import session from 'express-session'
import cookieParser from 'cookie-parser'

// Routes ****************************************************************
import userRoute from './router/user.router'
import encomiendaRoute from './router/encomienda.router'
import sedeRoute from './router/sede.router'
import loginRoute from './router/access-control/login.route'
import registerRoute from './router/access-control/register.router'
import documentRoute from './router/generatedocument'

const app: Express = express();

const corsOptions = {
  origin: [
    "http://localhost:8081",
    "http://localhost:3000",
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
app.use(cookieParser())

app.use(passport.initialize());
app.use(passport.session());

require("./auth/config.passport")(passport);

app.use("/api/user", userRoute);
app.use("/api/login", loginRoute);
app.use("/api/register", registerRoute);
app.use("/api/encomienda", encomiendaRoute);
app.use("/api/sede", sedeRoute);
app.use("/api/docs", documentRoute);


async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.authenticate();
    // await sequelize.sync({ alter: true });
    console.log("Database connection OK!");
  } catch (error) {
    console.log("Unable to connect to the database:");
    console.log(error);
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
