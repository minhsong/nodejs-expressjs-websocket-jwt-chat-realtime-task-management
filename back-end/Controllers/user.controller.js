const { matchedData } = require("express-validator");
const userService = require("../Services/user.service");
const { handleError } = require("../helpers/errorHandle.helper");
const { jwtSign } = require("../helpers/jwthelper");
const EmailService = require("../Services/EmailService");
const { userMenuBuilder } = require("../helpers/commonHelpers");

const register = async (req, res) => {
  const data = matchedData(req);
  const { email } = data;

  const existedUser = await userService.getUserByEmail(email);
  if (existedUser)
    return handleError(res, {
      message: "User with this email already exists!",
      code: 422,
    });

  return await userService
    .register(data)
    .then((user) => {
      return res.status(201).send(user);
    })
    .catch((err) => {
      return handleError(res, {
        message: err.message,
        code: 422,
      });
    });
};

const login = async (req, res) => {
  const data = matchedData(req);
  const { email, password } = data;

  await userService
    .login(email, password)
    .then(async (result) => {
      return res.status(200).send({
        user: { ...result, userId: undefined, navs: userMenuBuilder(result) },

        token: await jwtSign({
          id: result.userId,
          email: result.email,
          name: `${result.firstName} ${result.lastName}`,
        }),
      });
    })
    .catch((err) => {
      return handleError(res, {
        message: err.message,
        code: 422,
      });
    });
};

const getUser = async (req, res) => {
  const userId = req.user.id;
  return await userService
    .getUser(userId)
    .then((result) => {
      result.password = undefined;
      result.navs = userMenuBuilder(result);
      return res.status(200).send(result);
    })
    .catch((err) => {
      return handleError(res, {
        message: err.message,
        code: 422,
      });
    });
};

const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const data = matchedData(req);
  return await userService
    .updateProfile(userId, data)
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

const newAccessCode = async (req, res) => {
  const data = matchedData(req);
  return await userService
    .newAccessCode(data.email)
    .then((result) => {
      const emailService = new EmailService();
      emailService.sendEmail(
        data.email,
        "Your Access Code",
        `Your access code is: ${result.accessCode}`,
        `<p>Your access code is: <strong>${result.accessCode}</strong></p>`
      );
      return res.status(200).send({ success: true });
    })
    .catch((err) => {
      return handleError(res, {
        message: err.message,
        code: 422,
      });
    });
};

const verifyAccessCode = async (req, res) => {
  const data = matchedData(req);
  return await userService
    .validateAccessCode(data.email, data.accessCode)
    .then(async (result) => {
      return res.status(200).send({
        success: true,
        token: await jwtSign({
          id: result.userId,
          email: result.email,
          name: `${result.firstName} ${result.lastName}`,
        }),
      });
    })
    .catch((err) => {
      return handleError(res, {
        message: err.message,
        code: 422,
      });
    });
};

module.exports = {
  register,
  login,
  getUser,
  updateProfile,
  newAccessCode,
  verifyAccessCode,
};
