const mongoose = require("mongoose");

// var NameSchema = mongoose.Schema({
//   firstname: {type: String, required: true},
//   middlename: {type: String},
//   lastname: {type: String, required: true}
// })

var User = mongoose.model(
    "User",
    mongoose.Schema(
      {
        username: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        roles:    [{type: mongoose.Schema.Types.ObjectId, ref: "Role"}],
        fullname: {
          firstname: {type: String, required: true},
          middlenames: {type: String, required: false},
          lastname: {type: String, required: true}
        },
        address: {
          addressLine1: {type: String, required: true},
          addressLine2: {type: String},
          addressLine3: {type: String},
          addressLine4: {type: String},
          postcode: {type: String, required: true},
          city: {type: String, required: true},
          country: {type: String, required: true}
        },
        datetimeCreated: {type: Date, required: true, default: Date.now},
        datetimeUpdated: {type: Date, required: true, default: Date.now},
      }
    )
  );

module.exports = User;
