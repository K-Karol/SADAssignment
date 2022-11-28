import { Request, Response, NextFunction } from "express";
import mongoose, { AggregatePaginateModel, isValidObjectId, model, Schema, Types } from "mongoose";
import { GenerateAPIResult, GoThroughJSONAndReplaceObjectIDs, HttpException, RemoveUndefinedFieldsRoot } from "../helpers";
import { GetSessionForStudentBody, GetSessionForStudentParams_ControllerStage, GetSessionForStudentParams_ValidationStage, GetSessionsQuery, SessionPostRequest_ControllerStage, GetAttendenceForStudentParams_ControllerStage, UpdateStudentAttendanceBody, GetAttendenceForSessionParams, GetSessionsQueryBody, GetSessionByID_ControllerStage, SessionPutRequest_ControllerStage } from "../validation/session";
import { Module } from "../models/module";
import { ICohortWithAttendance, ISession, IStudentWithAttendance } from "../interfaces/session";
import { Session, SessionPaginate } from "../models/session";
import { GenerateBaseExcludes as UserGenerateBaseExcludes } from "../models/user";
import { plainToInstance } from "class-transformer";
import { User } from "../models/user";
// import {aggregate} from 'mongoose-aggregate-paginate-v2';

export default class SessionController {

  public GetSessions = async (req: Request, res: Response, next: NextFunction) => {
    try {

      var reqQuery: GetSessionsQueryBody = req.body;

      if (reqQuery.filter) {
        GoThroughJSONAndReplaceObjectIDs(reqQuery.filter);
      }

      let aggregate_options = [];
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

      if (reqQuery.joinStudents) {

        aggregate_options.push(
          {
            '$unwind': {
              'path': '$cohort.students'
            }
          }, {
          '$lookup': {
            'from': 'users',
            'localField': 'cohort.students.student',
            'foreignField': '_id',
            'as': 'cohort.students.student'
          }
        }, {
          '$unwind': {
            'path': '$cohort.students.student'
          }
        }, {
          '$group': {
            '_id': '$_id',
            'students': {
              '$push': '$cohort.students'
            }
          }
        }, {
          '$lookup': {
            'from': 'sessions',
            'localField': '_id',
            'foreignField': '_id',
            'as': 'sessionDetails'
          }
        }, {
          '$unwind': {
            'path': '$sessionDetails'
          }
        }, {
          '$addFields': {
            'sessionDetails.cohort.students': '$students'
          }
        }, {
          '$replaceRoot': {
            'newRoot': '$sessionDetails'
          }
        }
        );

        UserGenerateBaseExcludes("cohort.students.student.").forEach((element) => {
          aggregate_options.push({ $project: element });
        });
      }

      if (reqQuery.joinModules) {
        aggregate_options.push({
          '$lookup': {
            'from': 'modules',
            'localField': 'module',
            'foreignField': '_id',
            'as': 'module'
          }
        }, {
          '$set': {
            'module': {
              '$arrayElemAt': [
                '$module', 0
              ]
            }
          }
        }
        );
      }


      if(reqQuery.joinActiveSessions){
        aggregate_options.push(
          {
            '$lookup': {
              'from': 'activesessions', 
              'let': {
                'session_id': '$_id'
              }, 
              'pipeline': [
                {
                  '$match': {
                    '$expr': {
                      '$eq': [
                        '$$session_id', '$session'
                      ]
                    }
                  }
                }
              ], 
              'as': 'activeSessions'
            }
          }
        );
      }

      if (reqQuery.filter) aggregate_options.push({ $match: reqQuery.filter });


      const myAggregate = SessionPaginate.aggregate(aggregate_options);
      SessionPaginate.aggregatePaginate(myAggregate, options)
        .then((result) =>
          res.status(200).json(GenerateAPIResult(true, result))
        )
        .catch((err) => {
          console.log(err);
          next(new HttpException(500, "Failed to fetch sessions", undefined, err));
        });


    } catch (err) {
      next(err);
    }
  }

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

      var attendanceList = await Promise.all(session!.cohort.students.map(async (s) => {
        var ur = await User.findById(s.student);
        return { id: s.student, username: ur?.username, fullname: ur?.fullname, attendance: s.attendance };
      }));

      res.status(200).json(GenerateAPIResult(true, attendanceList));

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

      var ur = await User.findById(attendanceForUser?.student);
      //return {id : attendanceForUser.student, username: ur?.username, fullname: ur?.fullname, attendance: attendanceForUser.attendance};
      res.status(200).json(GenerateAPIResult(true, { id: attendanceForUser.student, username: ur?.username, fullname: ur?.fullname, attendance: attendanceForUser.attendance }));

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
  };

  public DeleteSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params: GetSessionByID_ControllerStage = plainToInstance(GetSessionByID_ControllerStage, (req as any)["params"], {});

      const deleteRes = await Session.deleteOne({ _id: params.sessionID });

      if (deleteRes.deletedCount != 1) throw new HttpException(400, "Failed to delete");

      res.status(200).json(GenerateAPIResult(true, "Deleted", undefined));

    } catch (err) {
      next(err);
    }
  };

  public GetSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      var params: GetSessionByID_ControllerStage = plainToInstance(GetSessionByID_ControllerStage, (req as any)["params"], {});

      const session = await Session.findById(
        params.sessionID,
      );

      if (!session) throw new HttpException(400, "Session not found");

      res.status(200).json(GenerateAPIResult(true, session, undefined));

    } catch (err) {
      next(err);
    }
  };

  public UpdateSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const putRequest: SessionPutRequest_ControllerStage = plainToInstance(SessionPutRequest_ControllerStage, req.body, {});
      const params: GetSessionByID_ControllerStage = plainToInstance(GetSessionByID_ControllerStage, (req as any)["params"], {});

      if ((putRequest.type == undefined) && (putRequest.module == undefined) && (putRequest.cohort == undefined) && (putRequest.startDateTime == undefined) && (putRequest.endDateTime == undefined)) {
        throw new HttpException(400, "Put request contains no data to update");
      }

      var deltaObj = RemoveUndefinedFieldsRoot(putRequest);

      //check if id exists so failure can be 500?

      const updateRes = await Session.updateOne({ _id: params.sessionID }, deltaObj);

      if (updateRes.modifiedCount != 1) throw new HttpException(400, "Failed to update");


      const newSession = await Session.findById(params.sessionID);
      if (!newSession) throw new HttpException(400, "Failed to find Session and/or update");

      res.status(200).json(GenerateAPIResult(true, newSession, undefined));


    }
    catch (err) {
      next(err);
    }
  }
};
}
