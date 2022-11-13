import { Schema, model, connect, AggregatePaginateModel, Document } from 'mongoose';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { ICourse } from '../interfaces/course';


// const options = { discriminatorKey: '_type' };

const courseSchema = new Schema<ICourse>(
  {
    name : {type: String, required: true},
    yearOfEntry: {type: String, required: true},
    courseLeader : {type: Schema.Types.ObjectId, ref: "User", required: true},
    modules: [{type: Schema.Types.ObjectId, ref: "Module", required: true}],
    students: [{type: Schema.Types.ObjectId, ref: "User", required: true}],
  },
  { timestamps: true }
);

courseSchema.plugin(aggregatePaginate);



interface CourseModel<T extends Document> extends AggregatePaginateModel<T> {}

// export const User: UserModel<IUser> = model<IUser>("User",UserSchema) as UserModel<IUser>;

interface ICoursePaginate extends ICourse, Document{}

export const Course = model<ICourse>("Course",courseSchema);

export const CoursePaginate: CourseModel<ICoursePaginate> = model<ICoursePaginate>("Course",courseSchema) as CourseModel<ICoursePaginate>;


Course.schema.index({name: 1, yearOfEntry: 1}, {unique: true});