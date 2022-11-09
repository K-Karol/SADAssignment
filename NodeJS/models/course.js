const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");


// const options = { discriminatorKey: '_type' };

const courseSchema = new mongoose.Schema(
  {
    name : {type: String, required: true},
    yearOfEntry: {type: String, required: true},
    courseLeader : {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    modules: [{type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true}],
    students: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}],
  },
  { timestamps: true }
);

courseSchema.plugin(aggregatePaginate);

var Course = mongoose.model(
    "Course",
    courseSchema
  );

Course.schema.index({name: 1, yearOfEntry: 1}, {unique: true}); //see if this works!

module.exports = Course;
