const mongoose = require("mongoose");


var User = mongoose.model(
    "users",
    mongoose.Schema(
      {
        username: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        roles:    [{type: mongoose.Schema.Types.ObjectId, ref: "roles"}]
      }
    )
  );

module.exports = User;
