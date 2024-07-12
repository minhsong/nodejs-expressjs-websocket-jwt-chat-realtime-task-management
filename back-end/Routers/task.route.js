const express = require("express");
const taskController = require("../Controllers/task.controller");
const {
  updateTaskValidator,
  createTaskValidator,
} = require("../Controllers/task.validator");
const router = express.Router();

router.get("/", taskController.getTasks);
router.get("/:id", taskController.getTask);
router.post("/", createTaskValidator, taskController.createTask);
router.put("/:id", updateTaskValidator, taskController.updateTask);
router.put("/markDone/:id", taskController.markTaskAsDone);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
