const mongoose = require("mongoose");

var User = mongoose.model(
    "users",
    mongoose.Schema(
      {
        username: {type: String, unique: true, required: true},
        password: {type: String, required: true}
      }
    )
  );

module.exports = User;
