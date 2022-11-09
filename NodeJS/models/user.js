const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
//const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = new mongoose.Schema(
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
    }
  },
  { timestamps: true }
);

UserSchema.plugin(aggregatePaginate);
//UserSchema.plugin(mongoosePaginate);

var User = mongoose.model("User",UserSchema);

const BaseExcludes = [
  {"password" : 0}
]

exports.User = User;
exports.BaseExcludes = BaseExcludes;