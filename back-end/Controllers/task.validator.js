const { check } = require("express-validator");
const { validationResult } = require("../helpers/validator.help");

exports.createTaskValidator = [
  check("title", "Title is required").not().isEmpty(),
  check("description", "Description is required").optional().isString(),
  check("status").optional().isIn(["pending", "inprogress", "done"]),
  check("assignee").optional().isString(),
  (req, res, next) => {
    validationResult(req, res, next);
  },
];

exports.updateTaskValidator = [
  check("title", "Title is required").not().isEmpty(),
  check("description", "Description is required").optional().isString(),
  check("status").optional().isIn(["pending", "inprogress", "done"]),
  check("assignee").optional().isString(),
  (req, res, next) => {
    validationResult(req, res, next);
  },
];
