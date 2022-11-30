import { Request, Response, NextFunction } from "express";
import mongoose, { AggregatePaginateModel, isValidObjectId, Schema, Types } from "mongoose";
import { GenerateAPIResult, GoThroughJSONAndReplaceObjectIDs, HttpException } from "../helpers";
import bcrypt from "bcryptjs";
import { GenerateBaseExcludes as UserGenerateBaseExcludes, User } from "../models/user";
import { IAuthenticatedRequest } from "../interfaces/auth";
import { Module } from "../models/module";
import { ICohortWithAttendance, ISession } from "../interfaces/session";
import { Session, SessionPaginate } from "../models/session";
import { Exclude, plainToInstance } from "class-transformer";
import { CreateNewActiveSessionRequest_ControllerStage, RecordStudentAttendanceRequest } from "../validation/active_session";
import { IRole, IUser } from "../interfaces/user";
import { IModule } from "../interfaces/module";
import { ActiveSession } from "../models/active_session";
import { IActiveSession } from "../interfaces/active_session";
// import {aggregate} from 'mongoose-aggregate-paginate-v2';

export default class ActiveSessionController {

    public GenerateNewActiveSession = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            var requestDetails: CreateNewActiveSessionRequest_ControllerStage = plainToInstance(CreateNewActiveSessionRequest_ControllerStage, (req as any)["params"], {});

            const session = await Session.findById(requestDetails.sessionID).populate("module");
            if (!session) {
                throw new HttpException(500, "Failed to find session post-validation");
            }


            const existingActiveSession = await ActiveSession.findOne({ session: session });

            if (existingActiveSession) {
                throw new HttpException(400, "An active session was already generated for this scheduled session");
            }

            const isAdmin = ((req.User! as IUser).roles! as IRole[]).find((r) => r.name == "Admin");

            const currentUserID = (((req.User! as typeof User) as any)["_id"] as Types.ObjectId);

            if (!isAdmin) {
                if (!((session.module as IModule).moduleLeader as Types.ObjectId).equals(currentUserID)
                    && !((session.module as IModule).instructors as Types.ObjectId[]).some((inst: Types.ObjectId) => inst.equals(currentUserID))) {
                    throw new HttpException(403, "You are not authorised to initiate an active attendance session for this scheduled session");
                }
            }

            var generatedSuccessfulCode: boolean = false;

            const maximumStackCount = 16;
            var stackCount = 0;
            var generatedCode: string = "";
            while (!generatedSuccessfulCode && stackCount < maximumStackCount) {
                stackCount++;
                generatedCode = this.GenerateSessionCode();
                const duplActiveSession = await ActiveSession.findOne({ code: generatedCode });
                if (!duplActiveSession) {
                    generatedSuccessfulCode = true;
                }
            }

            const generatedActiveSession: IActiveSession = { session: session, code: generatedCode };

            const newActiveSession = await ActiveSession.create(generatedActiveSession);
            const activeSession = await newActiveSession.save();

            res.status(200).json(GenerateAPIResult(true, { code: newActiveSession.code }));
        }
        catch (err) {
            next(err);
        }
    }

    public RecordStudentAttendance = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            var requestDetails: RecordStudentAttendanceRequest = (req as any)["params"];

            var succesfullyUpdated = false;
            var maxStack = 16;
            var stackCount = 0;
            while(!succesfullyUpdated && stackCount < maxStack){
                stackCount++;
                const currentActiveSession = await ActiveSession.findOne({code: requestDetails.code});

                if(!currentActiveSession){
                    throw new HttpException(400, "Active Session not found");
                }
    
                const session = await Session.findById(currentActiveSession.session);

                if(!session){
                    throw new HttpException(500, "Unable to register attendnace", undefined, new Error("Session not found"));
                }
    
                const currentUserID = (((req.User! as typeof User) as any)["_id"] as Types.ObjectId);
    
                const foundSessionAttendance = (session as ISession).cohort.students.find((s) => (s.student as Types.ObjectId).equals(currentUserID));
    
                if(!foundSessionAttendance){
                    throw new HttpException(400, "Could not find your user as part of this session");
                }
    
                if(foundSessionAttendance.attendance != "not"){
                    throw new HttpException(400, "You have previously recorded your attendance");
                }

                foundSessionAttendance.attendance = "full";
    
                try{
                    session.save();
                    succesfullyUpdated = true;
                }
                catch(err){
                    if(!(err instanceof mongoose.Error.VersionError)){
                        throw new HttpException(500, "Unable to register attendnace", undefined, err as Error);
                    }
                }
            }
            res.status(200).json(GenerateAPIResult(true));

        } catch (err) {
            next(err);
        }
    }

    private GenerateSessionCode = (): string => {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

}