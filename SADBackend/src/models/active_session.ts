import { Schema, model, connect, AggregatePaginateModel, Document } from 'mongoose';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IActiveSession } from '../interfaces/active_session';


// const options = { discriminatorKey: '_type' };

const activeSessionSchema = new Schema<IActiveSession>(
  {
    session: {type: Schema.Types.ObjectId, ref: "Session", required: true},
    code: {type: String, unique: true}
  },
  { timestamps: true }
);

//activeSessionSchema.plugin(aggregatePaginate);



//interface SessionModel<T extends Document> extends AggregatePaginateModel<T> {}

// export const User: UserModel<IUser> = model<IUser>("User",UserSchema) as UserModel<IUser>;

//interface ISessionPaginate extends ISession, Document{}

export const ActiveSession = model<IActiveSession>("ActiveSession",activeSessionSchema);

//export const SessionPaginate: SessionModel<ISessionPaginate> = model<ISessionPaginate>("Session",sessionSchema) as SessionModel<ISessionPaginate>;