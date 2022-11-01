const mongoose = require("mongoose");

//implement some role cache?

var Role = mongoose.model(
    "roles",
    mongoose.Schema(
      {
        name: {type: String, unique: true, required: true},
      }
    )
  );

module.exports = Role;
