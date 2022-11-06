"use strict";
require("dotenv").config();
const User = require("../models/user");
const Role = require("../models/role")
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens
const respGen = require("../apiResponse");
const { SECRET = "secret" } = process.env;

exports.login = async (req, res) => {
  try {
    // check if the user exists
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      //check if password matches
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        // sign token with id and a random salt and send it in response
        // const array = new Uint32Array(10);
        // crypto.getRandomValues(array);

        //generate a salt and store in a cache (redis?) as an additional measure incase the secret is exposed? Then check the salt againt cache.
        const token = await jwt.sign({ userId: user._id}, SECRET, {
          expiresIn: "2h",
        });

        var decoded = await jwt.decode(token, { complete: true });

        res.json(
          respGen.generateResult(
            true,
            { token, expiry: decoded.payload.exp },
            null
          )
        );
      } else {
        res
          .status(400)
          .json(respGen.generateResult(false, null, "Details are incorrect"));
      }
    } else {
      res
        .status(400)
        .json(respGen.generateResult(false, null, "Details are incorrect"));
    }
  } catch (error) {
    res
      .status(400)
      .json(respGen.generateResult(false, null, "Details are incorrect"));
  }
};
