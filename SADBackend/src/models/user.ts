import { Schema, model, connect } from 'mongoose';
import {IAddress, IFullname, IUser} from '../interfaces/user';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
//const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = new Schema<IUser>(
  {
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    roles:    [{type: Schema.Types.ObjectId, ref: "Role"}],
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

export const User = model("User",UserSchema);

const BaseExcludes = [
  {"password" : 0}
]
