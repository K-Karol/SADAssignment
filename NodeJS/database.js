"use strict";

require("dotenv").config()
const mongoose = require("mongoose");

const {DATABASE_URL} = process.env 

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('connected', () => {console.log('database connected succesfully')});
db.on('disconnected', () => {console.log('database disconnected succesfully')});
db.on('error', console.error.bind(console, 'connection error:'));


module.exports = db;