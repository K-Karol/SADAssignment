import { Type, Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsInt, IsIn, IsDate, IsISO8601 } from "class-validator";
import { Types } from "mongoose";
import "reflect-metadata";
import { Module } from "../models/module";
import { Session } from "../models/session";
import { User } from "../models/user";
import { DoesObjectIdExist, IsArrayOfMongooseObjectId, IsMongooseObjectId } from "./custom-decorators";

export class SessionPostRequest{
    @IsIn(["lecture", "seminar"])
    @IsString()
    @IsNotEmpty()
    type!: string;
    @DoesObjectIdExist(Module)
    @Type(() => Types.ObjectId)
    @IsMongooseObjectId()
    @IsNotEmpty()
    module!: Types.ObjectId;
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

export class GetSessionForStudentParams{
    @IsNotEmpty()
    @IsMongooseObjectId()
    @Type(() => Types.ObjectId)
    studentID!: Types.ObjectId
}

export class GetAttendenceForSessionParams{
    @DoesObjectIdExist(Session)
    @IsMongooseObjectId()
    sessionID!: string;
}

// export class GetAttendenceForSessionParams{
//   @IsNotEmpty()
//   @IsMongooseObjectId()
//   @Transform(({value}) => new Types.ObjectId(value))
//   @DoesObjectIdExist(Session)
//   @Type(() => Types.ObjectId)
//   sessionID!: Types.ObjectId;
// }


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