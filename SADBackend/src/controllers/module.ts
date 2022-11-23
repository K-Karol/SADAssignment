import { Request, Response, NextFunction } from "express";
import { AggregatePaginateModel, isValidObjectId, Schema, Types } from "mongoose";
import { GenerateAPIResult, GoThroughJSONAndReplaceObjectIDs, HttpException } from "../helpers";
import bcrypt from "bcryptjs";
import { GenerateBaseExcludes as UserGenerateBaseExcludes } from "../models/user";
import { Course, CoursePaginate } from "../models/course";
import { ICourse } from "../interfaces/course";
import { IAuthenticatedRequest } from "../interfaces/auth";
import { GetModuleByID_ControllerStage, GetModulesQueryBody, PostModuleRequest_ControllerStage } from "../validation/module";
import { plainToInstance } from "class-transformer";
import { ICohort, IModule } from "../interfaces/module";
import { Module, ModulePaginate } from "../models/module";
// import {aggregate} from 'mongoose-aggregate-paginate-v2';

export default class ModuleController {
    public PostModule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            var postDetails: PostModuleRequest_ControllerStage = plainToInstance(PostModuleRequest_ControllerStage, req.body, {});

            var parsedModule: IModule = {
                name: postDetails.name,
                year: postDetails.year,
                semester: postDetails.semester,
                students: postDetails.students,
                cohorts: postDetails.cohorts.map((c) => { var newCoh: ICohort = { identifier: c.identifier, students: c.students }; return newCoh; }),
                moduleLeader: postDetails.moduleLeader,
                instructors: postDetails.instructors
            };

            const newModule = new Module(parsedModule);
            const module = await newModule.save();
            res.status(200).json(GenerateAPIResult(true, newModule._id, undefined));
        }
        catch (err) {
            next(err);
        }
    }

    public GetModules = async (req: Request, res: Response, next: NextFunction) => {
        try {
            var reqQuery: GetModulesQueryBody = req.body;
            if (reqQuery.filter) {
                GoThroughJSONAndReplaceObjectIDs(reqQuery.filter);
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
                    docs: "modules",
                },
            };


            // LAST PIPELINE!!!
            if (reqQuery.joinStudents) {
                aggregate_options.push(
                    {
                        '$unwind': {
                            'path': '$cohorts'
                        }
                    }, {
                    '$lookup': {
                        'from': 'users',
                        'localField': 'cohorts.students',
                        'foreignField': '_id',
                        'as': 'cohorts.students'
                    }
                }, {
                    '$group': {
                        '_id': '$_id',
                        'cohorts': {
                            '$push': '$cohorts'
                        }
                    }
                }, {
                    '$lookup': {
                        'from': 'modules',
                        'localField': '_id',
                        'foreignField': '_id',
                        'as': 'moduleDetail'
                    }
                }, {
                    '$unwind': {
                        'path': '$moduleDetail'
                    }
                }, {
                    '$addFields': {
                        'moduleDetail.cohorts': '$cohorts'
                    }
                }, {
                    '$replaceRoot': {
                        'newRoot': '$moduleDetail'
                    }
                }
                );

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


                UserGenerateBaseExcludes("cohorts.students.").forEach((element) => {
                    aggregate_options.push({ $project: element });
                });
            }

            if (reqQuery.filter) aggregate_options.push({ $match: reqQuery.filter });

            const myAggregate = ModulePaginate.aggregate(aggregate_options);
            ModulePaginate.aggregatePaginate(myAggregate, options)
                .then((result) =>
                    res.status(200).json(GenerateAPIResult(true, result))
                )
                .catch((err) => {
                    console.log(err);
                    next(new HttpException(500, "Failed to fetch modules", undefined, err));
                });

        }
        catch (err) {
            next(err);
        }
    };

    public DeleteModule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const params: GetModuleByID_ControllerStage = plainToInstance(GetModuleByID_ControllerStage, (req as any)["params"], {});
      
            const deleteRes = await Module.deleteOne({ _id: params.id });
      
            if (deleteRes.deletedCount != 1) throw new HttpException(400, "Failed to delete");
      
            res.status(200).json(GenerateAPIResult(true, "Deleted", undefined));
      
          } catch (err) {
            next(err);
          }
    };

    // public GetModule = async (req: Request, res: Response, next: NextFunction) => {

    // }
}
