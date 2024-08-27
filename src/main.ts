import * as dotenv from 'dotenv'

dotenv.config();

import express, { Express } from 'express'

import sequelize from './database/connection'
import cors, { CorsOptions } from 'cors'
import passport from 'passport'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import formidable from 'formidable'

// Routes ****************************************************************
import userRoute from './router/user.router'
import encomiendaRoute from './router/encomienda.router'
import sedeRoute from './router/sede.router'
import loginRoute from './router/access-control/login.route'
import registerRoute from './router/access-control/register.router'
import documentRoute from './router/generatedocument'
import wpRoute from './router/wp.router'
import statisticsRoute from './router/statistics.router'

const app: Express = express();

// Middleware para parsear datos binarios
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }));

const whitelist = ["https://karma-app-roan.vercel.app", "http://localhost:3000", "http://127.0.0.1:3000", "https://anditransas.xyz"];

const corsOptions: CorsOptions = {
  allowedHeaders: ["Origin, X-Requested-With, Content-Type, Accept", "Access-Control-Allow-Credentials"],
  credentials: true,
  origin(requestOrigin, callback) {
    if (whitelist.includes(requestOrigin!)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "OPTIONS"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  session({
    cookie: { secure: false, maxAge: 60000 },
    secret: "secret",
    resave: false,
    saveUninitialized: false
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
app.use("/api/wp", wpRoute);
app.use("/api/statistics", statisticsRoute);


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
