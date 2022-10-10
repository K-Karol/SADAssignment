"use strict";

const mongoose = require("mongoose");

mongoose.connect(`mongodb://test:123@nginx:2000/testing?authMechanism=DEFAULT`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('connected', () => {console.log('database connected succesfully')});
db.on('disconnected', () => {console.log('database disconnected succesfully')});
db.on('error', console.error.bind(console, 'connection error:'));


module.exports = db;