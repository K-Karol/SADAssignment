"use strict";
require("dotenv").config();
const Course = require("../models/course");
const respGen = require("../apiResponse");
const Validator = require("jsonschema").Validator;

const mongoosePaginate = require("mongoose-paginate-v2");
const { default: mongoose } = require("mongoose");

const pipeline = require("../queryPipeline");

const courseSchema = require("../schema/course");

const limit_ = 20;


//expects a pagination pipeline

// {
//     "filter" : {"yearOfEntry" : "2022" or "yearOfEntry" : {"$gte" : "2022"}},
//     "sort" : {}
// }

exports.getCourses = async (req, res) => {
  let aggregate_options = [];
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || limit_;

  const options = {
    page,
    limit,
    collation: { locale: "en" },
    customLabels: {
      totalDocs: "totalResults",
      docs: "courses",
    },
  };

//   let match = {};

//   if (req.query.q) match.name = { $regex: req.query.q, $options: "i" };

//   if (req.query.yearOfEntry) {
//     match.yearOfEntry = { $gte: new Date(d), $lt: new Date(next_day) };
//   }

    if(req.body.filter) aggregate_options.push({$match : req.body.filter});

    

  //   aggregate_options.push({ $project: { password: 0 } });
  //   aggregate_options.push({
  //     $lookup: {
  //       from: "roles",
  //       localField: "roles",
  //       foreignField: "_id",
  //       as: "roles",
  //     },
  //   });
  //   aggregate_options.push({ $project: { "roles._id": 0 } });
  //   aggregate_options.push({ $project: { "roles.__v": 0 } });
  //   aggregate_options.push({ $project: { __v: 0 } });

  const myAggregate = Course.aggregate(aggregate_options);
  Course.aggregatePaginate(myAggregate, options)
    .then((result) =>
      res.status(200).json(respGen.generateResult(true, result))
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(respGen.generateResult(false, null, err));
    });
};

exports.getCourse = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json(
          respGen.generateResult(false, null, "ID is not in the valid format")
        );
    }

    const course = await Course.findById(id);

    if (!course)
      return res
        .status(401)
        .json(respGen.generateResult(false, null, "Course does not exist"));

    res.status(200).json(respGen.generateResult(true, course, null));
  } catch (error) {
    res.status(500).json(respGen.generateResult(false, null, error.message));
  }
};

exports.postCourse = async (req, res) => {
  try {
    var v = new Validator();
    var result = v.validate(req.body, courseSchema);

    if (!result.valid) {
      res
        .status(400)
        .json(
          respGen.generateResult(
            false,
            null,
            "Request JSON in incorrect format."
          )
        );
      return;
    }

    const newCourse = new Course(req.body);
    const course = await newCourse.save();
    res.status(200).json(respGen.generateResult(true, newCourse._id, null));
  } catch (error) {
    res.status(500).json(respGen.generateResult(false, null, error.message));
  }
};
