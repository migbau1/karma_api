import { PassportStatic } from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import sequelize from '../database/connection'
import { ModelCtor, Sequelize } from 'sequelize';
import { ICredencialesModel } from '../database/models/Credenciales';
import { isMatch } from '../utils/hash/password.hash';
import { IUserModel } from '../database/models/Usuarios';
import { ISedeModel } from '../database/models/Sede';

const { models } = sequelize

const credenciales = sequelize.model('credenciales') as ModelCtor<ICredencialesModel>
const usuarios = sequelize.model('usuarios') as ModelCtor<IUserModel>
const usuarioSedeModel = sequelize.model('usuario_sedes') as ModelCtor<ISedeModel>

function configPassport(passport: PassportStatic) {
  passport.use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: "secret",
      },
      async (payload, done) => {
        try {
          const user: any = await usuarios.findOne({
            where: { id: payload.id },
            attributes: [
              "id",
              "nombre", "apellido",
              [Sequelize.col('rol_id'), 'roleId'],
              [Sequelize.col('credenciale.email'), 'email'],
              [Sequelize.col('usuario_sede.sede_id'), 'sedeId']
            ],
            include: [
              {
                model: credenciales,
                attributes: []
              },
              {
                model: usuarioSedeModel
              }
            ],
            raw: true
          });

          if (!user) {
            return done(null, false, { msg: "no hay" });
          }

          return done(null, {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            rol_id: user.roleId!,
            sedeId: user.sedeId
          });
        } catch (error) {
          console.log(error);
          return done(error);
        }
      }
    )
  );

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (username: string, password: string, done) => {
        const transaction = await sequelize.transaction()
        try {
          const credentials = await credenciales.findOne({
            where: { email: username },
            include: [
              {
                model: usuarios,
                required: true,
                attributes: {
                  exclude: ['credencialeId', 'credencial_id', 'credencialId']
                },
                include: [{
                  model: usuarioSedeModel
                }]
              }
            ],
            transaction
          })

          if (!credentials) {
            return done(null, false, {
              message: "the user don't exist",
            });
          }

          const validate = isMatch(password, credentials.password)

          if (!validate) {
            return done(null, false, {
              message: "The email or password is incorrect",
            });
          }

          const tempUser = credentials.get().usuario?.get()

          await transaction.commit()

          return done(null, {
            id: tempUser?.id,
            nombre: tempUser?.nombre!,
            apellido: tempUser?.apellido!,
            rol_id: tempUser?.roleId!,
            sedeId: tempUser?.usuarioSede?.usuarioId!
          });
        } catch (error) {
          await transaction.rollback()
          console.log(error);

          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    return done(null, user);
  });
  passport.deserializeUser(async (user: any, done) => {
    try {
      let usuario: any = await usuarios.findByPk(user.id, {
        attributes: ["id", "nombre", "apellido", "rol_id"],
      });
      return done(null, usuario.get());
    } catch (error) {
      return done(error);
    }
  });
}

module.exports = configPassport;
