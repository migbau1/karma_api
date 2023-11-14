const jwt = require("jsonwebtoken");
const passport = require("passport");

function loginPost(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
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

      return res.status(200).json({
        msg: `Bienvenido de vuelta ${user.name}.`,
        token: hash,
      });
    });
  })(req, res, next);
}

function validateToken(req,res) {
  res.status(200).json({
    authorizate: true
  })
}


module.exports = { loginPost, validateToken };
