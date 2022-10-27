"use strict";
require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens
const respGen = require("../apiResponse")
const { SECRET = "secret" } = process.env;

exports.register = async (req, res) => {
    try {
        // hash the password
        req.body.password = await bcrypt.hash(req.body.password, 10);
        // create a new user
        const user = await User.create(req.body);
        res.status(200).json(respGen.generateResult(true, null, null));
      } catch (error) {
        res.status(400).json(respGen.generateResult(false, null, error));
      }
};

exports.login = async (req, res) => {
    try {
        // check if the user exists
        const user = await User.findOne({ username: req.body.username });
        if (user) {
          //check if password matches
          const result = await bcrypt.compare(req.body.password, user.password);
          if (result) {
            // sign token and send it in response
            const token = await jwt.sign({ username: user.username }, SECRET, {
              expiresIn: "2h"
            });
            var decoded = await jwt.decode(token, { complete: true });

            res.json(respGen.generateResult(true, {token, expiry : decoded.payload.exp}, null));

          } else {
            res.status(400).json(respGen.generateResult(false, null, "Details are incorrect"));
          }
        } else {
          res.status(400).json(respGen.generateResult(false, null, "Details are incorrect"));
        }
      } catch (error) {
        res.status(400).json(respGen.generateResult(false, null, "Details are incorrect"));
      }
}