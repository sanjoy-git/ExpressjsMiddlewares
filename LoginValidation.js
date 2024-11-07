const jwt = require("jsonwebtoken");
// require("dotenv").config();
const { JWT_SECRET_KEY } = require("../models/env");

const loginValidation = (req, res, next) => {
  try {
    const { authorization } = req?.headers;

    const pureToken = authorization?.split(" ")[1];
    jwtVerify(next, pureToken);
  } catch (error) {
    next(error.message);
  }
};

//json web token verify;
const jwtVerify = (next, pureToken) => {
  jwt.verify(pureToken, JWT_SECRET_KEY, (err, verify) => {
    if (err) {
      next(err?.message);
      // console.log("test1");
    } else if (verify) {
      next();
    } else {
      next("jwt something wrong");
      // console.log("test2");
    }
  });
};

module.exports = loginValidation;
