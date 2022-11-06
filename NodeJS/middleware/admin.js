require("dotenv").config(); // loading env variables
const resGen = require("../apiResponse");

// auth middleware. Use this during routing to make sure the request is properly authorised.
const authAPIKey = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const apikey = req.headers.authorization.split(" ")[1]; //split the header and get the token
      if(req.headers.authorization.split(" ")[0] != "App"){
        res
        .status(401)
        .json(resGen.generateResult(false, false, "Invalid authorization header"));
        return;
      }

      if(apikey != process.env.ADMIN_APIKEY){
        res
        .status(401)
        .json(resGen.generateResult(false, false, "Invalid key"));
        return;
      }

      next();

    } else {
      res
        .status(401)
        .json(resGen.generateResult(false, false, "No authorization header"));
        return;
    }
  } catch (error) {
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
  authAPIKey
};
