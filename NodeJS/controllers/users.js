"use strict";
require("dotenv").config();
const User = require("../models/user");
const Role = require("../models/role");
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const respGen = require("../apiResponse");
const Validator = require("jsonschema").Validator;
const crypto = require("crypto");

const { SECRET = "secret" } = process.env;

const addressSchema = require("../schema/address");
const fullnameSchema = require("../schema/fullname");
const userDetailsSchema = require("../schema/userDetails");
const userRegisterSchema = require("../schema/userRegistrationRequest");
const mongoosePaginate = require("mongoose-paginate-v2");
const { default: mongoose } = require("mongoose");

const limit_ = 20;

exports.register = async (req, res) => {
  var v = new Validator();
  v.addSchema(addressSchema, "/Address");
  v.addSchema(fullnameSchema, "/Fullname");
  v.addSchema(userDetailsSchema, "/UserRegistrationDetails");
  var result = v.validate(req.body, userRegisterSchema);

  if (!result.valid) {
    res
      .status(400)
      .json(
        respGen.generateResult(false, null, "Request JSON in incorrect format.")
      );
    return;
  }

  if (req.body.generatePassword == false && !req.body.userDetails.password) {
    res
      .status(400)
      .json(
        respGen.generateResult(
          false,
          null,
          "Password needs to be supplied if 'generatePassword' is false"
        )
      );
    return;
  }

  var passwordToReturn = "";

  if (req.body.generatePassword) {
    var charsToUse =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!&#@/()%^";
    var passwordLength = 16;
    var randomByte = new Uint8Array(1);
    var password = "";
    for (let index = 0; index < passwordLength; index++) {
      while (true) {
        crypto.webcrypto.getRandomValues(randomByte);
        var char = String.fromCharCode(randomByte[0]);
        if (charsToUse.includes(char)) {
          password += char;
          break;
        }
      }
    }
    passwordToReturn = password;
    req.body.userDetails.password = await bcrypt.hash(password, 10);
  } else {
    req.body.userDetails.password = await bcrypt.hash(
      req.body.userDetails.password,
      10
    );
  }

  try {
    const newUser = await User.create(req.body.userDetails);
    if (req.body.generatePassword == true) {
      res
        .status(200)
        .json(
          respGen.generateResult(
            true,
            { generatedPassword: passwordToReturn },
            null
          )
        );
    } else {
      res.status(200).json(respGen.generateResult(true, null, null));
    }
  } catch (error) {
    console.error(`"/users/register: ${error}`);
    res
      .status(400)
      .json(respGen.generateResult(false, null, "Failed to register the user"));
  }
};

exports.getUsers = async (req, res) => {
  let aggregate_options = [];
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || limit_;

  const options = {
    page,
    limit,
    collation: { locale: "en" },
    customLabels: {
      totalDocs: "totalResults",
      docs: "users",
    },
  };

  aggregate_options.push({ $project: { password: 0 } });
  aggregate_options.push({
    $lookup: {
      from: "roles",
      localField: "roles",
      foreignField: "_id",
      as: "roles",
    },
  });
  aggregate_options.push({ $project: { "roles._id": 0 } });
  aggregate_options.push({ $project: { "roles.__v": 0 } });
  aggregate_options.push({ $project: { __v: 0 } });

  const myAggregate = User.aggregate(aggregate_options);
  User.aggregatePaginate(myAggregate, options)
    .then((result) =>
      res.status(200).json(respGen.generateResult(true, result))
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(respGen.generateResult(false, null, err));
    });
};

exports.getUser = async (req, res) => {
  try{

    const id = req.params.id;

    if(!mongoose.isValidObjectId(id)){
      return res.status(400).json(respGen.generateResult(false, null, "ID is not in the valid format"));
    }

    const user = await User.findById(id, { password: 0 }, {populate: "roles"});

    if (!user) return res.status(401).json(respGen.generateResult(false, null, "User does not exist"));

    res.status(200).json(respGen.generateResult(true, user, null));

  } catch(error){
    res.status(500).json(respGen.generateResult(false, null, error.message));
  }
}

exports.postUser = async (req, res) => {
  try {
    var v = new Validator();
    v.addSchema(addressSchema, "/Address");
    v.addSchema(fullnameSchema, "/Fullname");
    var result = v.validate(req.body, userDetailsSchema);

    if (!result.valid) {
      res
        .status(400)
        .json(
          respGen.generateResult(
            false,
            null,
            "Request JSON in incorrect format."
          )
        );
      return;
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);
    const newUser = new User(req.body);
    const user = await newUser.save();
    res.status(200).json(respGen.generateResult(true, newUser._id, null));
  } catch (error) {
    res.status(500).json(respGen.generateResult(false, null, error.message));
  }
};



// exports.postUserBatched = async (req, res) => {
//     try {
//         req.body.password = await bcrypt.hash(req.body.password, 10);
//         const newUser = new User(req.body);
//         const user = await newUser.save();
//         res.status(200).json(respGen.generateResult(true, newUser._id, null))
//     } catch (error) {
//       res.status(500).json(respGen.generateResult(false, null, error.message));
//     }
// }
