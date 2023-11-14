const { Strategy } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const { ExtractJwt } = require("passport-jwt");
const { models } = require("../database/connection");

function configPassport(passport) {
  passport.use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: "secret",
      },
      async (payload, done) => {
        try {
          const user = await models.userCredentials.findOne({
            where: { id: payload.id },
            attributes: ["id", "email", "name"],
          });

          if (!user) {
            return done(null, false, { msg: "no hay" });
          }
          return done(null, user.get());
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (username, password, done) => {
        try {
          let user = await models.userCredentials.findOne({
            where: { email: username },
            attributes: ["id", "email","password", "name"],
          });
          if (!user) {
            return done(null, false, {
              message: "the user don't exist",
            });
          }

          if (
            user.get().password !== password ||
            user.get().email !== username
          ) {
            return done(null, false, {
              message: "The email or password is incorrect",
            });
          }

          return done(null, {
            id: user.getDataValue('id'),
            email: user.getDataValue('email'),
            name: user.getDataValue("name")
          });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    return done(null, user);
  });
  passport.deserializeUser(async (user, done) => {
    try {
      let usuario = await models.userCredentials.findByPk(user.id, {
        attributes: ["id","email","name"],
      });
      return done(null, usuario.get());
    } catch (error) {
      return done(error);
    }
  });
}

module.exports = configPassport;
