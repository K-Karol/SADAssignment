require("dotenv").config(); // loading env variables
const jwt = require("jsonwebtoken");
const resGen = require("../apiResponse");
const User = require("../models/user");

// auth middleware. Use this during routing to make sure the request is properly authorised.
const authenticateRequest = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1]; //split the header and get the token
      if (token) {
        const payload = await jwt.verify(token, process.env.SECRET);
        if (payload) {
          User.findOne({ _id: payload.userId }).populate("roles").exec((err, usr) => {
            if (err) {
              res.status(401).json(
                  resGen.generateResult(
                    false,
                    false,
                    "User not found"
                  )
                );
                return;
            }
            req.user = usr;
            next();

          });
        } else {
          res
            .status(401)
            .json(
              resGen.generateResult(false, false, "Token verification failed")
            );
        }
      } else {
        res
          .status(401)
          .json(resGen.generateResult(false, false, "Malformed auth header"));
      }
    } else {
      res
        .status(401)
        .json(resGen.generateResult(false, false, "No authorization header"));
    }
  } catch (error) {
    console.error(error);
    res.status(401).json(resGen.generateResult(false, false, error));
  }
};

const checkRoles = (roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      res
        .status(500)
        .json(resGen.generateResult(false, false, "Failed to check role"));
      return;
    }

    const found = req.user.roles.some((r) => roles.includes(r.name));
      if (found) {
        next();
        return;
      } else {
        res
          .status(401)
          .json(resGen.generateResult(false, false, "You are not authorised"));
      }
    
  };
};
module.exports = {
  authenticateRequest,
  checkRoles,
};
