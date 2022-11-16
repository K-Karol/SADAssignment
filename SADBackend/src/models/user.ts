import { Schema, model, connect, AggregatePaginateModel, Document } from 'mongoose';
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

interface UserModel<T extends Document> extends AggregatePaginateModel<T> {}

// export const User: UserModel<IUser> = model<IUser>("User",UserSchema) as UserModel<IUser>;

interface IUserPaginate extends IUser, Document{}

export const User = model<IUser>("User",UserSchema);
export const UserPaginate: UserModel<IUserPaginate> = model<IUserPaginate>("User",UserSchema) as UserModel<IUserPaginate>;

//export const ArtistModel: ArtistModel<IArtist> = model<IArtist>('Artist', ArtistSchema);
//export const ArtistModel: ArtistModel<IArtist> = model<IArtist>('Artist', ArtistSchema) as ArtistModel<IArtist>;
//export const User = model("User",UserSchema);

export const BaseExcludes = [
  {"password" : 0}
]

export function GenerateBaseExcludes(rootPath: string){
  var passwordObj : any = {};
  passwordObj[rootPath+"password"] = 0;
  return [passwordObj]
}
