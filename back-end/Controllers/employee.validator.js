const { check } = require("express-validator");
const { validationResult } = require("../helpers/validator.help");

exports.createEmployeeValidator = [
  check("firstName", "First Name is required").not().isEmpty(),
  check("lastName", "Last Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("phone", "Phone number is required").not().isEmpty(),
  check("status").optional().isIn(["active", "inactive"]),
  (req, res, next) => {
    validationResult(req, res, next);
  },
];

exports.updateEmployeeValidator = [
  check("firstName", "First Name is required").not().isEmpty(),
  check("lastName", "Last Name is required").not().isEmpty(),
  check("phone", "Phone number is required").not().isEmpty(),
  check("status").optional().isIn(["active", "inactive"]),
  (req, res, next) => {
    validationResult(req, res, next);
  },
];
