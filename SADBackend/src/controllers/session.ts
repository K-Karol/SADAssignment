import { Request, Response, NextFunction } from "express";
import { AggregatePaginateModel, isValidObjectId, Schema, Types } from "mongoose";
import { GenerateAPIResult, GoThroughJSONAndReplaceObjectIDs, HttpException } from "../helpers";
import bcrypt from "bcryptjs";
import { GenerateBaseExcludes as UserGenerateBaseExcludes } from "../models/user";
import { IAuthenticatedRequest } from "../interfaces/auth";
import { GetSessionForStudentBody, GetSessionForStudentParams_ControllerStage, GetSessionForStudentParams_ValidationStage, GetSessionsQuery, SessionPostRequest_ControllerStage } from "../validation/session";
import { Module } from "../models/module";
import { ICohortWithAttendance, ISession } from "../interfaces/session";
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
}