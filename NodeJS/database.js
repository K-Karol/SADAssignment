"use strict";

require("dotenv").config()
const mongoose = require("mongoose");

const {DATABASE_URL} = process.env 

const Role = require("./models/role")

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('connected', db_onConnected);
db.on('disconnected', () => {console.log('database disconnected succesfully')});
db.on('error', console.error.bind(console, 'connection error:'));

function db_onConnected(){
  console.log("database connected succesfully");

  Role.count(async (err, res) => {
    if(err){
      console.error(err);
      return;
    }
    
    if(res > 0){
      return;
    }

    await Role.create({name: "Admin"});

  })

}

module.exports = db;