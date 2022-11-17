import { Request, Response, NextFunction } from "express";
import mongoose, { AggregatePaginateModel, isValidObjectId, Schema, Types } from "mongoose";
import { GenerateAPIResult, GoThroughJSONAndReplaceObjectIDs, HttpException } from "../helpers";
import { GetSessionForStudentBody, GetSessionForStudentParams_ControllerStage, GetSessionForStudentParams_ValidationStage, GetSessionsQuery, SessionPostRequest_ControllerStage, GetAttendenceForStudentParams_ControllerStage, UpdateStudentAttendanceBody } from "../validation/session";
import { Module } from "../models/module";
import { ICohortWithAttendance, ISession, IStudentWithAttendance } from "../interfaces/session";
import { Session, SessionPaginate } from "../models/session";
import { plainToInstance } from "class-transformer";
// import {aggregate} from 'mongoose-aggregate-paginate-v2';

export default class SessionController {

    public PostSession = async (req: Request, res: Response, next: NextFunction) => {
        try {
            var postRequest: SessionPostRequest_ControllerStage = plainToInstance(SessionPostRequest_ControllerStage, req.body, {});

            var module = await Module.findById(postRequest.module);

      if (!module) {
        throw new HttpException(400, "Module cannot be found");
      }

      var foundCohort = module.cohorts.filter((c) => c.identifier == postRequest.cohortIdentifier)[0];

      if (!foundCohort) {
        throw new HttpException(400, `Cohort '${postRequest.cohortIdentifier}' cannot be found`);
      }

      var generatedCohort: ICohortWithAttendance = {
        identifier: foundCohort.identifier,
        students: foundCohort.students.map((s) => {
          return { student: s, attendance: "not" }
        })
      }

      const sessionParsed: ISession = { type: postRequest.type, module: module, cohort: generatedCohort, startDateTime: postRequest.startDateTime, endDateTime: postRequest.endDateTime };

      const newSession = new Session(sessionParsed);
      const session = await newSession.save();

      res.status(200).json(GenerateAPIResult(true, session._id));

    } catch (err) {
      next(err);
    }
  }

    public GetAllSessionsForStudent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            var params: GetSessionForStudentParams_ControllerStage = plainToInstance(GetSessionForStudentParams_ControllerStage, (req as any)["params"], {});
            var queryBody: GetSessionForStudentBody = req.body;

      if (!isValidObjectId(params.studentID)) {
        throw new HttpException(400, "studentID is not in the valid format");
      }

      if (queryBody.filter) {
        GoThroughJSONAndReplaceObjectIDs(queryBody.filter);
      }

      let aggregate_options = [];

      var temp = req.query.page;

      let page = 1;
      let limit = 20;

      if (req.query.page) {
        page = parseInt(req.query.page as string);
      }

      if (req.query.limit) {
        limit = parseInt(req.query.limit as string);
      }

      const options = {
        page,
        limit,
        collation: { locale: "en" },
        customLabels: {
          totalDocs: "totalResults",
          docs: "sessions",
        },
      };

            aggregate_options.push(
                {
                    $match: {
                        $expr: {
                            $in: [params.studentID, "$cohort.students.student"]
                        }
                    }
                }, {
                $unwind: {
                    path: "$cohort.students"
                }
            },
                {
                    $match: {
                        "cohort.students.student": params.studentID
                    }
                },
                {
                    $set: {
                        "cohort.student": "$cohort.students.student"
                    }
                },
                { $unset: 'cohort.students' }
            );

            //remove irrelevant students

            if (queryBody.filter) aggregate_options.push({ $match: queryBody.filter });

      const myAggregate = SessionPaginate.aggregate(aggregate_options);

      SessionPaginate.aggregatePaginate(myAggregate, options)
        .then((result) => res.status(200).json(GenerateAPIResult(true, result)))
        .catch((err) => {
          next(new HttpException(500, "Failed to fetch users", undefined, err));
        });

    } catch (err) {
      next(err);
    }
  }

  public GetSessionAttendence = async (req: Request, res: Response, next: NextFunction) => {
    try { //get the attendence for all students in a session
      var params: GetAttendenceForSessionParams = (req as any)["params"];

      const session = await Session.findById(
        params.sessionID
      ); //find the session by ID

      if (!session) { //should never be an issue
        throw new HttpException(500, "Session was not found after validation stage");
      }

      // var sessions = await Session.aggregate([
      //   {
      //     $match: { "_id": new mongoose.Types.ObjectId(params.sessionID) }
      //   },
      //   {
      //     $lookup: {
      //       from: "users",
      //       let: { "student": "$cohort." },
      //       localField: "cohort.students.student",
      //       foreignField: "_id",
      //       as: "cohort.students.student",
      //     }
      //   },
      // ]);

      var attendanceList = session!.cohort.students

      res.status(200).json(GenerateAPIResult(true, attendanceList));

      //const session = await Session.findById(params.sessionID, {"cohort.students.student.password" : 0, "cohort.students.student.address" : 0, "cohort.students.student.roles" : 0}, {populate : "cohort.students.student"});

      // const sessions = await Session.aggregate([
      //   {
      //     $match : {"_id" : params.sessionID}
      //   },
      //   {
      //     $lookup: {
      //         from: "users",
      //         localField: "cohort.students.student",
      //         foreignField: "_id",
      //         as: "student",
      //     }
      //   },
      //   {
      //     "$project" : {"cohort.students.student.password" : 0}
      //   },
      //   {
      //     "$project" : {"cohort.students.student.address" : 0}
      //   },
      //   {
      //     "$project" : {"cohort.students.student.roles" : 0}
      //   }
      // ]);

      // var nO = new mongoose.Types.ObjectId("6374eceadb31e5f26ef6e6e2");
      // var tmp = params.sessionID as mongoose.Types.ObjectId;


      // var students = session?.cohort.students;

      // var idk = students?.map((s) => {var n = {student: s.student, attendance: s.attendance}; return n;});

      // var queryBody: GetSessionForStudentBody = req.body; //get the filter info

      // if (queryBody.filter) { //conver the filter object ID's to vaild format
      //     GoThroughJSONAndReplaceObjectIDs(queryBody.filter);
      // }

      // let aggregate_options = [];
      // //var temp = req.query.page;

      // let page = 1;
      // let limit = 20;

      // if (req.query.page) { //number of pages
      //     page = parseInt(req.query.page as string);
      // }

      // if (req.query.limit) { //number of reaults per page
      //     limit = parseInt(req.query.limit as string);
      // }

      // const options = {
      //     page,
      //     limit,
      //     collation: { locale: "en" },
      //     customLabels: {
      //         totalDocs: "totalResults",
      //         docs: "sessions",
      //     },
      // };

      // // aggregate_options.push( //?
      // //     {
      // //         $match : {
      // //             $expr: {
      // //                 $in: [params.sessionID, "$_id"]
      // //               }
      // //         }
      // //     }
      // // );


      // // aggregate_options.push( //?
      // //     {
      // //         $match : {"_id" : params.sessionID}
      // //     }
      // // );


      // if (queryBody.filter) aggregate_options.push({ $match: queryBody.filter }); //add the filter to the options is a filter was requested

      // const myAggregate = SessionPaginate.aggregate(aggregate_options);

      // SessionPaginate.aggregatePaginate(myAggregate, options) //convert to the session model? I think
      //     .then((result) => res.status(200).json(GenerateAPIResult(true, result)))
      //     .catch((err) => {
      //         next(new HttpException(500, "Failed to fetch sessions", undefined, err));
      //     });

    } catch (err) {
      next(err);
    }
  }

  //following two methods may be better as user controller methods rather than session methods
  public GetUserAttendence = async (req: Request, res: Response, next: NextFunction) => {
    try {
      var params: GetAttendenceForStudentParams_ControllerStage = plainToInstance(GetAttendenceForStudentParams_ControllerStage, (req as any)["params"], {});

      const session = await Session.findById(
        params.sessionID
      ); //find the session by ID

      if (!session) {
        throw new HttpException(500, "Session was not found after validation stage");
      }

      var attendanceForUser = session!.cohort.students.find((s) => (s.student as Types.ObjectId).equals(params.studentID));

      if (!attendanceForUser) {
        throw new HttpException(400, "User's attendance was not found for this session");
      }

      res.status(200).json(GenerateAPIResult(true, attendanceForUser));

    } catch (err) {
      next(err);
    }
  }

  public PatchUserAttendence = async (req: Request, res: Response, next: NextFunction) => {
    try {
      var params: GetAttendenceForStudentParams_ControllerStage = plainToInstance(GetAttendenceForStudentParams_ControllerStage, (req as any)["params"], {});
      var newattendance: UpdateStudentAttendanceBody = req.body;

      const session = await Session.findById(
        params.sessionID
      ); //find the session by ID

      if (!session) {
        throw new HttpException(500, "Session was not found after validation stage");
      }

      var attendanceForUser = session!.cohort.students.find((s) => (s.student as Types.ObjectId).equals(params.studentID));

      if (!attendanceForUser) {
        throw new HttpException(400, "User's attendance was not found for this session");
      }

      attendanceForUser.attendance = newattendance.attendance;

      await session.save();

      res.status(200).json(GenerateAPIResult(true, attendanceForUser));

    } catch (err) {
      next(err);
    }
  }
}
