const mongoose = require("mongoose");

var Module = mongoose.model(
    "Module",
    mongoose.Schema(
      {
        name : {type: String, required: true},
        year: {type: String, required: true},
        semester: {type: String, required: true}, //create a custom schema type?  examples: SEM1 or change to an integer?,
        students: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}],
        cohorts: [{
          identifier: {type: String, required: true},
          students: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}]
        }],
        moduleLeader: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        instructors: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}]
      },
      { timestamps: true }
    )
  );

module.exports = Module;
