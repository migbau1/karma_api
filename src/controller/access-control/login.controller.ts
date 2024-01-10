import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { IUserModel } from '../../database/models/Usuarios';

function loginPost(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("local",
    (err: string,
      user: Express.User,
      info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json(info);
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        let hash = jwt.sign(user, "secret", {
          expiresIn: "24h",
        });

        res.cookie("JWT_TOKEN", hash)

        return res.status(200).json({
          nombre: `${user.nombre} ${user.apellido}`,
          email: user.email,
          rol: user.rol_name,
          token: hash,
        });
      });
    })(req, res, next);
}

function validateToken(req: Request, res: Response) {
  res.status(200).json({
    authorizate: true
  })
}

const checkUserRole = (requiredRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  if (req.user && requiredRoles.includes(req.user.rol_id!)) {
    return next();
  } else {
    return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
  }
}


export { loginPost, validateToken, checkUserRole };
