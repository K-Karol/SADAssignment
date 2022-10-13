const mongoose = require("mongoose");

var User = mongoose.model(
    "users",
    mongoose.Schema(
      {
        username: String,
        email: String,
        firstname: String,
        lastname: String
      }
    )
  );

module.exports = User;
