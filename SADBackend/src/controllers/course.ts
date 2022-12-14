import { Request, Response, NextFunction } from "express";
import { AggregatePaginateModel, isValidObjectId, Schema, Types } from "mongoose";
import { GenerateAPIResult, GoThroughJSONAndReplaceObjectIDs, HttpException, RemoveUndefinedFieldsRoot } from "../helpers";
import bcrypt from "bcryptjs";
import { CoursePutRequest_ControllerStage, GetCourseByID_ControllerStage, GetCourseByID_ValidationStage, GetCoursesQuery, PostCourse_ControllerStage, PostCourse_ValidationStage } from "../validation/course";
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
        var reqQuery: GetCoursesQuery = plainToInstance(GetCoursesQuery, (req['query'] as any), {});

        if (reqQuery.filter) {
            try {
                reqQuery.filter = JSON.parse((reqQuery.filter as unknown as string));
            } catch (err) {
                throw new HttpException(400, "Cannot convert the filter to a JSON object", undefined, err as Error);
            }
            GoThroughJSONAndReplaceObjectIDs(reqQuery.filter);
        }

        let aggregate_options = [];
        let page = 1;
        let limit = 20;

        if (reqQuery.page) {
            page = reqQuery.page;
        }

        if (reqQuery.limit) {
            limit = reqQuery.limit;
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

        if (reqQuery.joinModules) {
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
        var reqQuery: GetCoursesQuery = plainToInstance(GetCoursesQuery, (req['query'] as any), {});

        if (reqQuery.filter) {
            try {
                reqQuery.filter = JSON.parse((reqQuery.filter as unknown as string));
            } catch (err) {
                throw new HttpException(400, "Cannot convert the filter to a JSON object", undefined, err as Error);
            }
            GoThroughJSONAndReplaceObjectIDs(reqQuery.filter);
        }

        let aggregate_options = [];
        let page = 1;
        let limit = 20;

        if (reqQuery.page) {
            page = reqQuery.page;
        }

        if (reqQuery.limit) {
            limit = reqQuery.limit;
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

        if (reqQuery.joinModules) {
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


        aggregate_options.push({ $match: { courseLeader: new Types.ObjectId((req.User! as any)["_id"]) } });


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
                name: courseToPost.name,
                yearOfEntry: courseToPost.yearOfEntry,
                courseLeader: courseToPost.courseLeader,
                modules: courseToPost.modules,
                students: courseToPost.students ? courseToPost.students : []
            };
            const newCourse = new Course(courseParsed);
            const course = await newCourse.save();
            res.status(200).json(GenerateAPIResult(true, newCourse._id, undefined));

        } catch (err) {
            next(err);
        }
    };

    public GetCourse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            var params: GetCourseByID_ControllerStage = plainToInstance(GetCourseByID_ControllerStage, (req as any)["params"], {});

            const course = await Course.findById(
                params.id,
            );

            if (!course) throw new HttpException(400, "Course not found");

            res.status(200).json(GenerateAPIResult(true, course, undefined));

        } catch (err) {
            next(err);
        }
    };

    public UpdateCourse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const putRequest: CoursePutRequest_ControllerStage = plainToInstance(CoursePutRequest_ControllerStage, req.body, {});
            const params: GetCourseByID_ControllerStage = plainToInstance(GetCourseByID_ControllerStage, (req as any)["params"], {});

            if ((putRequest.name) == undefined && (putRequest.yearOfEntry == undefined) && (putRequest.courseLeader == undefined) && (putRequest.modules == undefined) && (putRequest.students == undefined)) {
                throw new HttpException(400, "Put request contains no data to update");
            }

            var deltaObj = RemoveUndefinedFieldsRoot(putRequest);

            //check if id exists so failure can be 500?

            const updateRes = await Course.updateOne({ _id: params.id }, deltaObj);

            if (updateRes.modifiedCount != 1) throw new HttpException(400, "Failed to update");


            const newCourse = await Course.findById(params.id);
            if (!newCourse) throw new HttpException(400, "Failed to find Course and/or update");

            res.status(200).json(GenerateAPIResult(true, newCourse, undefined));


        }
        catch (err) {
            next(err);
        }
    };

    public DeleteCourse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const params: GetCourseByID_ControllerStage = plainToInstance(GetCourseByID_ControllerStage, (req as any)["params"], {});

            const deleteRes = await Course.deleteOne({ _id: params.id });

            if (deleteRes.deletedCount != 1) throw new HttpException(400, "Failed to delete");

            res.status(200).json(GenerateAPIResult(true, "Deleted", undefined));

        } catch (err) {
            next(err);
        }
    };
}
