const { check } = require("express-validator");
const { validationResult } = require("../helpers/validator.help");

exports.registerValidator = [
  check("firstName", "First Name is required").not().isEmpty(),
  check("lastName", "Last Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("phone", "Phone number is required").not().isEmpty(),
  check("status").optional().isIn(["active", "inactive"]),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({
    min: 6,
  }),
  (req, res, next) => {
    validationResult(req, res, next);
  },
];

exports.loginValidator = [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
  (req, res, next) => {
    validationResult(req, res, next);
  },
];

exports.updateProfileValidator = [
  check("firstName", "First Name is required").not().isEmpty(),
  check("lastName", "Last Name is required").not().isEmpty(),
  check("phone", "Phone number is required").not().isEmpty(),
  check("status").optional().isIn(["active", "inactive"]),
  (req, res, next) => {
    validationResult(req, res, next);
  },
];

exports.newAccessCodeValidator = [
  check("email", "Please include a valid email").isEmail(),
  (req, res, next) => {
    validationResult(req, res, next);
  },
];

exports.verifyAccessCodeValidator = [
  check("email", "Please include a valid email").isEmail(),
  check("accessCode", "Access Code is required").not().isEmpty(),
  (req, res, next) => {
    validationResult(req, res, next);
  },
];
