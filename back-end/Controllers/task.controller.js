const { matchedData } = require("express-validator");
const userService = require("../Services/user.service");
const employeeService = require("../Services/employee.services");
const taskService = require("../Services/task.services");
const { handleError } = require("../helpers/errorHandle.helper");
const socket = require("../websocket/app.websocket");

exports.getTasks = async (req, res) => {
  const userId = req.user.id;

  return await taskService
    .getTasks()
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => {
      return handleError(res, {
        message: err.message,
        code: 422,
      });
    });
};

exports.getTask = async (req, res) => {
  const userId = req.user.id;

  const { id } = req.params;
  return await taskService
    .getTask(id)
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => {
      return handleError(res, {
        message: err.message,
        code: 422,
      });
    });
};

exports.createTask = async (req, res) => {
  const userId = req.user.id;

  const data = matchedData(req);
  if (
    data.assignee &&
    typeof data.assignee === "string" &&
    data.assignee !== ""
  ) {
    const existedEmployee = await employeeService.getEmployeeById(
      data.assignee
    );
    if (!existedEmployee)
      return handleError(res, {
        message: "Assigned employee not found!",
        code: 422,
      });

    data.assignee = {
      id: data.assignee,
      name: `${existedEmployee.firstName} ${existedEmployee.lastName}`,
    };
  }

  return await taskService
    .createTask(data)
    .then((result) => {
      socket.getIO().emit("task.created", result);
      return res.status(201).send(result);
    })
    .catch((err) => {
      return handleError(res, {
        message: err.message,
        code: 422,
      });
    });
};

exports.updateTask = async (req, res) => {
  const userId = req.user.id;

  const { id } = req.params;
  const data = matchedData(req);
  if (
    data.assignee &&
    typeof data.assignee === "string" &&
    data.assignee !== ""
  ) {
    const existedEmployee = await employeeService.getEmployeeById(
      data.assignee
    );
    if (!existedEmployee)
      return handleError(res, {
        message: "Assigned employee not found!",
        code: 422,
      });

    data.assignee = {
      id: data.assignee,
      name: `${existedEmployee.firstName} ${existedEmployee.lastName}`,
    };
  }

  return await taskService
    .updateTask(id, data)
    .then((result) => {
      socket.getIO().emit("task.updated", result);
      return res.status(200).send(result);
    })
    .catch((err) => {
      return handleError(res, {
        message: err.message,
        code: 422,
      });
    });
};

exports.deleteTask = async (req, res) => {
  const userId = req.user.id;

  const { id } = req.params;
  return await taskService
    .deleteTask(id)
    .then((result) => {
      socket.getIO().emit("task.deleted", result.id);
      return res.status(200).send({ id });
    })
    .catch((err) => {
      return handleError(res, {
        message: err.message,
        code: 422,
      });
    });
};

exports.markTaskAsDone = async (req, res) => {
  const userId = req.user.id;

  const { id } = req.params;
  return await taskService
    .markTaskAsDone(id)
    .then((result) => {
      socket.getIO().emit("task.done", result.id);
      return res.status(200).send(result);
    })
    .catch((err) => {
      return handleError(res, {
        message: err.message,
        code: 422,
      });
    });
};
