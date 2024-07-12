const jwt = require("jsonwebtoken");
const userService = require("../Services/user.service");

const generateToken = (id, email) => {
  const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRE_TIME,
  });
  return token.toString();
};

const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers["authorization"])
      return res
        .status(401)
        .send({ errors: { msg: "Authorization token not found!" } });

    const header = req.headers["authorization"];
    const token = header.split(" ")[1];

    await jwt.verify(
      token,
      process.env.JWT_SECRET,
      async (err, verifiedToken) => {
        if (err)
          return res
            .status(401)
            .send({
              errors: { msg: "Authorization token not found!" },
              details: err,
            });
        req.user = verifiedToken;
        next();
      }
    );
  } catch (error) {
    return res.status(500).send({
      errMesage: "Internal server error occured!",
      details: error.message,
    });
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
