import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean, IsIn, IsDate, IsISO8601 } from "class-validator";
import { Schema, Types } from "mongoose";
import "reflect-metadata";
import { Session } from "../models/session";
import { DoesObjectIdExist, IsArrayOfMongooseObjectId, IsMongooseObjectId } from "./custom-decorators";

export class CreateNewActiveSessionRequest_ControllerStage {
    @Transform(({value}) => new Types.ObjectId(value))
    sessionID!: Types.ObjectId
}

export class CreateNewActiveSessionRequest_ValidationStage {
    @DoesObjectIdExist(Session)
    @IsMongooseObjectId()
    @IsNotEmpty()
    sessionID!: string
}