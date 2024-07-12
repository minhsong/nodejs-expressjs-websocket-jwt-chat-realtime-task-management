const express = require("express");
const employeeController = require("../Controllers/employee.controller");
const {
  createEmployeeValidator,
  updateEmployeeValidator,
} = require("../Controllers/employee.validator");
const router = express.Router();

router.get("/", employeeController.getEmployees);
router.get("/emails", employeeController.getEmployeesEmails);
router.get("/:id", employeeController.getEmployee);
router.post("/", createEmployeeValidator, employeeController.createEmployee);
router.put("/:id", updateEmployeeValidator, employeeController.updateEmployee);
router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;
