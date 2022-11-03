"use strict";
require("dotenv").config();
const User = require("../models/user");
const Role = require("../models/role")
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const respGen = require("../apiResponse");
const Validator = require('jsonschema').Validator;
const crypto = require('crypto');

const { SECRET = "secret" } = process.env;

const addressSchema = require("../schema/address");
const fullnameSchema = require("../schema/fullname");
const userDetailsSchema = require("../schema/userDetails");
const userRegisterSchema = require("../schema/userRegistrationRequest");

exports.register = async (req, res) => {
    var v = new Validator();
    v.addSchema(addressSchema, '/Address');
    v.addSchema(fullnameSchema, "/Fullname");
    v.addSchema(userDetailsSchema, "/UserRegistrationDetails");
    var result = v.validate(req.body, userRegisterSchema);

    if(!result.valid){
        res.status(400).json(respGen.generateResult(false, null, "Request JSON in incorrect format."));
        return;
    }

    if(req.body.generatePassword == false && !req.body.userDetails.password){
        res.status(400).json(respGen.generateResult(false, null, "Password needs to be supplied if 'generatePassword' is false"));
        return;
    }

    var passwordToReturn = "";

    if(req.body.generatePassword){
        var charsToUse = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!&#@/()%^";
        var passwordLength = 16;
        var randomByte = new Uint8Array(1);
        var password = "";
        for (let index = 0; index < passwordLength; index++) {
            while(true){
                crypto.webcrypto.getRandomValues(randomByte);
                var char = String.fromCharCode(randomByte[0]);
                if(charsToUse.includes(char)){
                    password += char;
                    break;
                }

            }
        }
        passwordToReturn = password;
        req.body.userDetails.password = await bcrypt.hash(password, 10);
    } else{
        req.body.userDetails.password = await bcrypt.hash(req.body.userDetails.password, 10);
    }

    try{
        const newUser = await User.create(req.body.userDetails);
        if(req.body.generatePassword == true){
            res.status(200).json(respGen.generateResult(true, {generatedPassword : passwordToReturn}, null));
        } else{
            res.status(200).json(respGen.generateResult(true, null, null));

        }
    } catch (error){
        console.error(`"/users/register: ${error}`);
        res.status(400).json(respGen.generateResult(false, null, "Failed to register the user"));
    }
};