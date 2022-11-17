import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean, IsIn, IsDate, IsISO8601 } from "class-validator";
import { Schema, Types } from "mongoose";
import "reflect-metadata";
import { Module } from "../models/module";
import { Session } from "../models/session";
import { User } from "../models/user";
import { DoesObjectIdExist, IsArrayOfMongooseObjectId, IsMongooseObjectId } from "./custom-decorators";

export class SessionPostRequest_Stage1{
    @IsNotEmpty()
    @IsString()
    @IsIn(["lecture", "seminar"])
    @IsString()
    @IsNotEmpty()
    type!: string;
    @DoesObjectIdExist(Module)
    @IsMongooseObjectId()
    @IsNotEmpty()
    module!: string;
    @IsString()
    @IsNotEmpty()
    cohortIdentifier!: string;
    @IsISO8601()
    @IsNotEmpty()
    startDateTime!: Date;
    @IsISO8601()
    @IsNotEmpty()
    endDateTime!: Date;
}

export class SessionPostRequest_ControllerStage{
    type!: string;
    @Transform(({value}) => new Types.ObjectId(value))
    module!: Types.ObjectId;
    cohortIdentifier!: string;
    startDateTime!: Date;
    endDateTime!: Date;
}

export class GetSessionForStudentParams_ControllerStage{
    @Transform(({value}) => new Types.ObjectId(value))
    studentID!: Types.ObjectId
}


export class GetSessionForStudentParams_ValidationStage{
    @DoesObjectIdExist(User)
    @IsMongooseObjectId()
    @IsNotEmpty()
    studentID!: string
}

export class GetAttendenceForSessionParams{
    @DoesObjectIdExist(Session)
    @IsMongooseObjectId()
    sessionID!: string;
}



export class GetAttendenceForStudentParams_ControllerStage{
  @Transform(({value}) => new Types.ObjectId(value))
  sessionID!: Types.ObjectId;
  @Transform(({value}) => new Types.ObjectId(value))
  studentID!: Types.ObjectId;
}


export class GetAttendenceForStudentParams_ValidationStage{
    @DoesObjectIdExist(Session)
    @IsMongooseObjectId()
    sessionID!: string;
    @DoesObjectIdExist(User)
    @IsNotEmpty()
    @IsMongooseObjectId()
    studentID!: string;;
}

export class GetSessionForStudentBody{
    @IsOptional()
    @Type(() => Object)
    filter?: object
}
export class GetSessionsQuery{
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    page?: number;
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    limit?: number;
}

export class UpdateStudentAttendanceBody{
  @IsIn(["full", "not", "late"])
  @IsString()
  @IsNotEmpty()
  attendance!: string;
}