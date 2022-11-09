"use strict";
require("dotenv").config();
const {User} = require("../models/user");
const Role = require("../models/role")
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens
const respGen = require("../apiResponse");

exports.createAdminUser = async (req, res) => {
  try {
    // hash the password
    req.body.password = await bcrypt.hash(req.body.password, 10);

    const adminRole = await Role.findOne({name : "Admin"});
    if(!adminRole){
      res.status(500).json(respGen.generateResult(false, null, "Admin role not found"));
      return;
    }

    req.body.roles = [adminRole];

    // create a new user
    const user = await User.create(req.body);
    res.status(200).json(respGen.generateResult(true, null, null));
  } catch (error) {
    console.error(`"/admin/register: ${error}`);
    res.status(400).json(respGen.generateResult(false, null, "Failed to create the user"));
  }
};
