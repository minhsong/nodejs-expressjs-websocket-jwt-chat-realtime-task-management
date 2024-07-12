const express = require("express");
const userController = require("../Controllers/user.controller");
const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  newAccessCodeValidator,
  verifyAccessCodeValidator,
} = require("../Controllers/user.validator");
const router = express.Router();

router.post("/register", registerValidator, userController.register);
router.post("/login", loginValidator, userController.login);
router.get("/me", userController.getUser);
router.put("/me", updateProfileValidator, userController.updateProfile);
router.post(
  "/access-code",
  newAccessCodeValidator,
  userController.newAccessCode
);
router.post(
  "/verify-access-code",
  verifyAccessCodeValidator,
  userController.verifyAccessCode
);

module.exports = router;
