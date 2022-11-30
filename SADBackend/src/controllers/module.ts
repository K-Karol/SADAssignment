import { Request, Response, NextFunction } from "express";
import { AggregatePaginateModel, isValidObjectId, Schema, Types } from "mongoose";
import { GenerateAPIResult, GoThroughJSONAndReplaceObjectIDs, HttpException, RemoveUndefinedFieldsRoot } from "../helpers";
import bcrypt from "bcryptjs";
import { GenerateBaseExcludes as UserGenerateBaseExcludes } from "../models/user";
import { Course, CoursePaginate } from "../models/course";
import { ICourse } from "../interfaces/course";
import { IAuthenticatedRequest } from "../interfaces/auth";
import { GetModuleByID_ControllerStage, GetModulesQuery, ModulePutRequest_ControllerStage, PostModuleRequest_ControllerStage } from "../validation/module";
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
            //var reqQuery: GetModulesQueryBody = req.body;

            var reqQuery : GetModulesQuery = plainToInstance(GetModulesQuery, (req['query'] as any), {});

            if (reqQuery.filter) {
                try{
                    reqQuery.filter = JSON.parse((reqQuery.filter as unknown as string));
                } catch(err){
                    throw new HttpException(400, "Cannot convert the filter to a JSON object", undefined, err as Error);
                }
                
                GoThroughJSONAndReplaceObjectIDs(reqQuery.filter);
            }

            let aggregate_options = [];

            var temp = reqQuery.page;

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

    public GetModule = async (req: Request, res: Response, next: NextFunction) => {
        try {
          var params: GetModuleByID_ControllerStage = plainToInstance(GetModuleByID_ControllerStage, (req as any)["params"], {});
    
          const module = await Module.findById(
            params.id,
          );
    
          if (!module) throw new HttpException(400, "Module not found");
    
          res.status(200).json(GenerateAPIResult(true, module, undefined));
    
        } catch (err) {
          next(err);
        }
      };

    public UpdateModule = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const putRequest: ModulePutRequest_ControllerStage = plainToInstance(ModulePutRequest_ControllerStage, req.body, {});
          const params: GetModuleByID_ControllerStage = plainToInstance(GetModuleByID_ControllerStage, (req as any)["params"], {});
    
          if ((putRequest.name) == undefined && (putRequest.year == undefined) && (putRequest.semester == undefined) && (putRequest.students == undefined) && (putRequest.cohorts == undefined) && (putRequest.moduleLeader == undefined) && (putRequest.instructors == undefined)) {
            throw new HttpException(400, "Put request contains no data to update");
          }
    
          var deltaObj = RemoveUndefinedFieldsRoot(putRequest);
    
          //check if id exists so failure can be 500?
    
          const updateRes = await Module.updateOne({ _id: params.id }, deltaObj);
    
          if (updateRes.modifiedCount != 1) throw new HttpException(400, "Failed to update");
    
    
          const newModule= await Module.findById(params.id);
          if (!newModule) throw new HttpException(400, "Failed to find Module and/or update");
    
          res.status(200).json(GenerateAPIResult(true, newModule, undefined));
    
    
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
