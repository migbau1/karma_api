const router = require("express").Router();
const passport = require("passport");
const docsController = require("../utils/xlsxutil");
const controller = require("../controller/exports.controller");

router.post("/", passport.authenticate("jwt"), docsController);
router.post(
  "/reporteusuarios",
  passport.authenticate("jwt"),
  controller.exportUsers
);
router.post(
  "/reporteguias",
  passport.authenticate("jwt"),
  controller.exportGuias
);

module.exports = router;
