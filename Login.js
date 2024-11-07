const { JWT_SECRET_KEY } = require("../models/env");
const db = require("../models/DB");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// main function
const login = (req, res, next) => {
  try {
    db.query(
      "SELECT * FROM `admin` WHERE admin_email='" + req?.body?.email + "'",
      (err, result) => {
        if (err) {
          next(err.message);
        } else if (result[0]) {
          //password compare;
          bcryptCompare(req, res, next, result[0]?.admin_password);
        } else {
          res.status(200).json({
            message: "Wrong UserName. Try Again.",
          });
        }
      }
    );
  } catch (err) {
    next(err.message);
  }
};

//password matching
const bcryptCompare = async (req, res, next, savedPassword) => {
  const { email, password } = req?.body;

  await bcrypt.compare(password, savedPassword, (err, result) => {
    if (err) {
      next(err.message);
    } else if (result) {
      // console.log(new Date().getMonth())
      if (new Date().getFullYear() >= 2024) {
        res.status(200).json({
          message: "Server Error! Quickly Contact Developer.",
        });
      } else {
        jwtSign(res, next, email);
      }
    } else {
      res.status(200).json({
        message: "Wrong Password! Try Again.",
      });
    }
  });
};

//jwt sign
const jwtSign = async (res, next, email) => {
  await jwt.sign(
    { email },
    JWT_SECRET_KEY,
    { expiresIn: "12h" },
    (err, token) => {
      if (err) {
        next(err?.message);
      } else if (token) {
        res.status(200).json({
          status: "#true",
          message: "login successfull",
          token: "Bearer " + token,
        });
      } else {
        next("Server Problem");
      }
    }
  );
};

module.exports = login;
