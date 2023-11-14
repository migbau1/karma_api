const router = require("express").Router();
const passport = require("passport");
const controller = require("../controller/login.controller");

router.get("/", (req, res) => {
  res.send(req.body);
});

router.get("/fail", (req, res) => {
  console.log();
  res.send(res.message);
});

router.post("/", controller.loginPost);

router.post("/validate", passport.authenticate("jwt"), controller.validateToken);

module.exports = router;
