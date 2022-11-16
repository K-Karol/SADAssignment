import { Schema, model, connect } from 'mongoose';
import {IRole} from '../interfaces/user';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
//const mongoosePaginate = require('mongoose-paginate-v2');

const RoleSchema = new Schema<IRole>(
  {
    name: {type: String, unique: true, required: true},
  }
);

//RoleSchema.plugin(aggregatePaginate);

const Role = model("Role",RoleSchema);

export default Role;