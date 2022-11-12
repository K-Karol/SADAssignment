import { Schema, model, connect } from 'mongoose';
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

export const Course = model(
    "Course",
    courseSchema
  );

Course.schema.index({name: 1, yearOfEntry: 1}, {unique: true});