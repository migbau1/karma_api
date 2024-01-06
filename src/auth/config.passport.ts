import { PassportStatic } from 'passport';
import { Strategy, ExtractJwt, JwtFromRequestFunction } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import sequelize from '../database/connection'
import { ModelCtor, Sequelize } from 'sequelize';
import { ICredencialesModel } from '../database/models/Credenciales';
import { isMatch } from '../utils/hash/password.hash';
import { IUserModel } from '../database/models/Usuarios';
import { ISedeModel } from '../database/models/Sede';
import { IRolesModel } from '../database/models/Roles';

const { models } = sequelize

const credenciales = sequelize.model('credenciales') as ModelCtor<ICredencialesModel>
const usuarios = sequelize.model('usuarios') as ModelCtor<IUserModel>
const usuarioSedeModel = sequelize.model('usuario_sedes') as ModelCtor<ISedeModel>
const roleModel = sequelize.model('roles') as ModelCtor<IRolesModel>

const cookieExtractor: JwtFromRequestFunction = req => {
  let jwt = null

  if (req && req.cookies) {
    jwt = req.cookies['JWT_TOKEN']
  }

  return jwt
}

function configPassport(passport: PassportStatic) {
  passport.use(
    new Strategy(
      {
        jwtFromRequest: cookieExtractor,
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
              [Sequelize.col('role.name'), 'rolName'],
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
              },
              {
                model: roleModel
              }
            ],
            raw: true
          });

          if (!user) {
            return done(null, false, { msg: "no hay" });
          }

          console.log(user);

          return done(null, {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            rol_name: user.rolName!,
            rol_id: user.roleId,
            sedeId: user.sedeId,
            email: user.email
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
                },
                {
                  model: roleModel
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
            rol_name: tempUser?.role?.name!,
            rol_id: tempUser?.roleId!,
            email: credentials.email,
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
