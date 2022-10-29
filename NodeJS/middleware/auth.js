require("dotenv").config(); // loading env variables
const jwt = require("jsonwebtoken");
const resGen = require("../apiResponse");
const User = require("../models/user");

// auth middleware. Use this during routing to make sure the request is properly authorised.
const isLoggedIn = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1]; //split the header and get the token
      if (token) {
        const payload = await jwt.verify(token, process.env.SECRET);
        if (payload) {
          req.user = payload;
          next();
        } else {
            res.status(404).json(resGen.generateResult(false, false, "Token verification failed"));
        }
      } else {
        res.status(404).json(resGen.generateResult(false, false, "Malformed auth header"));
      }
    } else {
      res.status(404).json(resGen.generateResult(false, false, "No authorization header"));
    }
  } catch (error) {
    res.status(400).json(resGen.generateResult(false, false, error));
  }
};

const checkRoles = (roles) => {
  return async (req, res, next) => {
    if(req.user == null || req.user == undefined){
      res.status(500).json(resGen.generateResult(false, false, "Failed to check role"));
      return;
    }
  
    const user = await User.findOne({ username: req.user.username }); //chjange to ID?
  
    if(user){
  
      const found = user.roles.some(r => roles.includes(r.name));
      if(found){
        next();
        return;
      } else{
        res.status(401).json(resGen.generateResult(false, false, "You are not authorised"));
      }
  
    } else{
      res.status(500).json(resGen.generateResult(false, false, "Failed to check role"));
    }
  
  }
}
module.exports = {
  isLoggedIn,
  checkRoles
};
