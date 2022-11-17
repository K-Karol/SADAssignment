import { Schema, model, connect, AggregatePaginateModel, Document } from 'mongoose';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { ISession } from '../interfaces/session';


// const options = { discriminatorKey: '_type' };

const sessionSchema = new Schema<ISession>(
  {
    type: { type: String, enum: ['lecture', 'seminar'], required: true },
    module: { type: Schema.Types.ObjectId, ref: "Module", required: true },
    cohort: {
      identifier: { type: String, required: true },
      students: [{
        student: { type: Schema.Types.ObjectId, ref: "User", required: true },
        attendance: { type: String, enum: ['not', 'late', 'full'], required: true }
      }]
    },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true }
  },
  { timestamps: true }
);

sessionSchema.plugin(aggregatePaginate);

interface SessionModel<T extends Document> extends AggregatePaginateModel<T> { }

// export const User: UserModel<IUser> = model<IUser>("User",UserSchema) as UserModel<IUser>;

interface ISessionPaginate extends ISession, Document { }

export const Session = model<ISession>("Session", sessionSchema);

export const SessionPaginate: SessionModel<ISessionPaginate> = model<ISessionPaginate>("Session", sessionSchema) as SessionModel<ISessionPaginate>;