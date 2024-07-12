const { matchedData } = require("express-validator");
const userService = require("../Services/user.service");
const employeeService = require("../Services/employee.services");
const { handleError } = require("../helpers/errorHandle.helper");
const { generateRandomString } = require("../helpers/commonHelpers");
const EmailService = require("../Services/EmailService");

exports.getEmployees = async (req, res) => {
  const userId = req.user.id;

  return await employeeService
    .getEmployees()
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

exports.getEmployee = async (req, res) => {
  const userId = req.user.id;
  const loggedInUser = await userService.getUser(userId);

  if (loggedInUser.role !== "admin") {
    return handleError(res, {
      message: "You are not authorized to perform this action!",
      code: 401,
    });
  }

  const { id } = req.params;
  return await employeeService
    .getEmployee(id)
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

exports.createEmployee = async (req, res) => {
  const userId = req.user.id;
  const loggedInUser = await userService.getUser(userId);

  if (loggedInUser.role !== "admin") {
    return handleError(res, {
      message: "You are not authorized to perform this action!",
      code: 401,
    });
  }

  //check email existed
  const existingUser = await employeeService.getUserByEmail(req.body.email);
  if (existingUser)
    return handleError(res, {
      message: "User with this email already exists!",
      code: 422,
    });
  const emailService = new EmailService();
  const data = matchedData(req);
  data.password = generateRandomString(6);
  return await employeeService
    .createEmployee(data)
    .then((result) => {
      emailService
        .sendEmail(
          data.email,
          "[MinhSong Demo]Your account has been created",
          null,
          `<p>Your account has been created by Admin</p>. 
        <p> Login email:<b> ${data.email}</b></p>
        Your temporary password is: <b>${data.password}</b>`
        )
        .then((result) => {
          console.log("Email sent: ", result);
        })
        .catch((err) => {
          console.error("Error sending email: ", err);
        });
      return res.status(201).send({ success: true, employeeId: result.id });
    })
    .catch((err) => {
      return handleError(res, {
        message: err.message,
        code: 422,
      });
    });
};

exports.updateEmployee = async (req, res) => {
  const userId = req.user.id;
  const loggedInUser = await userService.getUser(userId);

  if (loggedInUser.role !== "admin") {
    return handleError(res, {
      message: "You are not authorized to perform this action!",
      code: 401,
    });
  }

  const { id } = req.params;
  const data = matchedData(req);
  return await employeeService
    .updateEmployee(id, data)
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

exports.deleteEmployee = async (req, res) => {
  const userId = req.user.id;
  const loggedInUser = await userService.getUser(userId);

  if (userId === req.params.id) {
    return handleError(res, {
      message: "You can't delete your own account!",
      code: 401,
    });
  }

  if (loggedInUser.role !== "admin") {
    return handleError(res, {
      message: "You are not authorized to perform this action!",
      code: 401,
    });
  }

  const { id } = req.params;
  return await employeeService
    .deleteEmployee(id)
    .then(() => {
      return res.status(200).send({ success: true });
    })
    .catch((err) => {
      return handleError(res, {
        message: err.message,
        code: 422,
      });
    });
};

exports.getEmployeesEmails = async (req, res) => {
  return await employeeService
    .getEmployees()
    .then((result) => {
      return res.status(200).send(result.map((s) => s.email));
    })
    .catch((err) => {
      return handleError(res, {
        message: err.message,
        code: 422,
      });
    });
};
