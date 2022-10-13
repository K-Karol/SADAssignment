"use strict";

const mongoose = require("mongoose");
const config = require("./configs/db_config");

mongoose.connect(config.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('connected', () => {console.log('database connected succesfully')});
db.on('disconnected', () => {console.log('database disconnected succesfully')});
db.on('error', console.error.bind(console, 'connection error:'));


module.exports = db;