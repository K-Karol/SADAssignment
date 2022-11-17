import { Request, Response, NextFunction } from "express";
import { AggregatePaginateModel, isValidObjectId, Schema, Types } from "mongoose";
import { GenerateAPIResult, GoThroughJSONAndReplaceObjectIDs, HttpException } from "../helpers";
import bcrypt from "bcryptjs";
import { GetCoursesQueryBody, PostCourse_ControllerStage, PostCourse_ValidationStage } from "../validation/course";
import { GenerateBaseExcludes as UserGenerateBaseExcludes, User } from "../models/user";
import { Course, CoursePaginate } from "../models/course";
import { ICourse } from "../interfaces/course";
import { IAuthenticatedRequest } from "../interfaces/auth";
import { plainToInstance } from "class-transformer";
// import {aggregate} from 'mongoose-aggregate-paginate-v2';

export default class CourseController {
    public GetCourses = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        var reqQuery: GetCoursesQueryBody = req.body;

        if(reqQuery.filter){
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
                docs: "courses",
            },
        };

        if (reqQuery.joinStudents) {
            aggregate_options.push({
                $lookup: {
                    from: "users",
                    localField: "students",
                    foreignField: "_id",
                    as: "students",
                },
            });

            UserGenerateBaseExcludes("students.").forEach((element) => {
                aggregate_options.push({ $project: element });
            });
        }

        if(reqQuery.joinModules){
            aggregate_options.push({
                $lookup: {
                    from: "modules",
                    localField: "modules",
                    foreignField: "_id",
                    as: "modules",
                },
            });
        }

        if (reqQuery.filter) aggregate_options.push({ $match: reqQuery.filter });


        const myAggregate = CoursePaginate.aggregate(aggregate_options);
        CoursePaginate.aggregatePaginate(myAggregate, options)
            .then((result) =>
                res.status(200).json(GenerateAPIResult(true, result))
            )
            .catch((err) => {
                console.log(err);
                next(new HttpException(500, "Failed to fetch courses", undefined, err));
            });

    };

    public GetMyCourses = async (
        req: IAuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        var reqQuery: GetCoursesQueryBody = req.body;

        if(reqQuery.filter){
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
                docs: "courses",
            },
        };

        if (reqQuery.joinStudents) {
            aggregate_options.push({
                $lookup: {
                    from: "users",
                    localField: "students",
                    foreignField: "_id",
                    as: "students",
                },
            });

            UserGenerateBaseExcludes("students.").forEach((element) => {
                aggregate_options.push({ $project: element });
            });
        }

        if(reqQuery.joinModules){
            aggregate_options.push({
                $lookup: {
                    from: "modules",
                    localField: "modules",
                    foreignField: "_id",
                    as: "modules",
                },
            });
        }

        if (reqQuery.filter) aggregate_options.push({ $match: reqQuery.filter });


        aggregate_options.push({$match: {courseLeader : new Types.ObjectId((req.User! as any)["_id"])} });


        const myAggregate = CoursePaginate.aggregate(aggregate_options);
        CoursePaginate.aggregatePaginate(myAggregate, options)
            .then((result) =>
                res.status(200).json(GenerateAPIResult(true, result))
            )
            .catch((err) => {
                console.log(err);
                next(new HttpException(500, "Failed to fetch courses", undefined, err));
            });

    };

    public PostCourse = async (req: Request, res: Response, next: NextFunction) => {
        var courseToPost: PostCourse_ControllerStage = plainToInstance(PostCourse_ControllerStage, req.body, {});

        try {
            const courseParsed: ICourse = {
                name : courseToPost.name,
                yearOfEntry: courseToPost.yearOfEntry,
                courseLeader : courseToPost.courseLeader,
                modules : courseToPost.modules,
                students : courseToPost.students ? courseToPost.students : []
            };
            const newCourse = new Course(courseParsed);
            const course = await newCourse.save();
            res.status(200).json(GenerateAPIResult(true, newCourse._id, undefined));

        } catch (err) {
            next(err);
        }
    };
}
