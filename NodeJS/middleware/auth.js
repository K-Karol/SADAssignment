require("dotenv").config(); // loading env variables
const jwt = require("jsonwebtoken");
const resGen = require("../apiResponse");

// MIDDLEWARE FOR AUTHORIZATION (MAKING SURE THEY ARE LOGGED IN)
const isLoggedIn = async (req, res, next) => {
  try {
    // check if auth header exists
    if (req.headers.authorization) {
      // parse token from header
      const token = req.headers.authorization.split(" ")[1]; //split the header and get the token
      if (token) {
        const payload = await jwt.verify(token, process.env.SECRET);
        if (payload) {
          // store user data in request object
          req.user = payload;
          // I would say to not store roles here incase they are revoked.
          next();
        } else {
            res.status(404).json(resGen.generateResult(false, false, "Token verification failed"));
        }
      } else {
        res.status(404).json(resGen.generateResult(false, false, "Malformed auth header"));

      }
    } else {
      //res.status(400).json({ error: "No authorization header" });
      res.status(404).json(resGen.generateResult(false, false, "No authorization header"));
    }
  } catch (error) {
    res.status(400).json(resGen.generateResult(false, false, error));
  }
};

// export custom middleware
module.exports = {
  isLoggedIn,
};
