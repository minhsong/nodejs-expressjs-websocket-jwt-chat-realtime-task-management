const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const extractTokenFromHeader = (request) => {
  const [type, token] = request.headers.authorization?.split(" ") ?? [];
  return type === "Bearer" ? token : undefined;
};

const jwtDecode = async (token) => {
  return await jwt.verify(token, process.env.JWT_SECRET);
};

const jwtSign = async (payload, options = {}) => {
  const token = jwt
    .sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
      ...options,
    })
    .toString();

  return token;
};

const comparePasswords = async (enteredPassword, storedPassword) => {
  return await bcrypt.compareSync(enteredPassword, storedPassword);
};

const hashPassword = async (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

module.exports = {
  extractTokenFromHeader,
  jwtDecode,
  jwtSign,
  comparePasswords,
  hashPassword,
};
