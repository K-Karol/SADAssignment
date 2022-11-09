const mongoose = require("mongoose");

//implement some role cache?

var Session = mongoose.model(
    "Session",
    mongoose.Schema(
      {
        type: {type: String, enum : ['lecture','seminar'], required: true},
        module: {type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true},
        cohort: {
          identifier: {type: String, required: true},
          students: [{
            student: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
            attendance: {type: String, enum : ['not', 'late', 'full'], required: true}
          }]
        },
        startDateTime: {type: Date, required: true},
        endDateTime: {type: Date, required: true}
      },
      { timestamps: true }
    )
  );

module.exports = Session;
