import { plainToInstance, Transform, Type } from "class-transformer";
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
    studentID!: string;
}
export class GetSessionsForStudentQuery{
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    page?: number;
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    limit?: number;

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

    @IsOptional()
    @Type(() => Object)
    filter?: object

    @IsBoolean()
    @Transform(({ value} ) => value === 'true' || value === 'True')
    @IsOptional()
    joinStudents?: boolean;

    @IsBoolean()
    @Transform(({ value} ) => value === 'true' || value === 'True')
    @IsOptional()
    joinModules?: boolean;

    
    @IsBoolean()
    @Transform(({ value} ) => value === 'true' || value === 'True')
    @IsOptional()
    joinActiveSessions?: boolean;
}

export class UpdateStudentAttendanceBody{
  @IsIn(["full", "not", "late"])
  @IsString()
  @IsNotEmpty()
  attendance!: string;
}

export class GetSessionByID_ControllerStage{
    @Transform(({value}) => new Types.ObjectId(value))
    sessionID!: Types.ObjectId;
}

export class GetSessionByID_ValidationStage{
    @DoesObjectIdExist(Session)
    @IsMongooseObjectId()
    @IsNotEmpty()
    sessionID!: string;
}


export class StudentAttendance_ControllerStage{
    @Transform(({value}) => new Types.ObjectId(value))
    student!: Types.ObjectId;
    attendance!: string;
}

export class StudentAttendance_ValidationStage{
    @DoesObjectIdExist(User)
    @IsMongooseObjectId()
    @IsNotEmpty()
    student!: string;
    @IsIn(["full", "not", "late"])
    @IsString()
    @IsNotEmpty()
    attendance!: string;
}

export class CohortWithAttendance_ControllerStage{
    identifier!: string;
    @Transform(({value}) => plainToInstance(StudentAttendance_ControllerStage, value, {}))
    students!: StudentAttendance_ControllerStage[];
}

export class CohortWithAttendance_ValidationStage {
    @IsString()
    @IsNotEmpty()
    identifier!: string;
    @IsNotEmpty()
    students!: StudentAttendance_ValidationStage[];
}

export class SessionPutRequest_ControllerStage{
    type?: string;
    @Transform(({value}) => new Types.ObjectId(value))
    module?: Types.ObjectId;
    //cohortIdentifier?: string; makes little sense here
    @Transform(({value}) => plainToInstance(CohortWithAttendance_ControllerStage, value, {}))
    cohort!: CohortWithAttendance_ControllerStage;
    startDateTime?: Date;
    endDateTime?: Date;
}

export class SessionPutRequest_ValidationStage{
    @IsString()
    @IsIn(["lecture", "seminar"])
    @IsOptional()
    type?: string;
    @IsOptional()
    cohort!: CohortWithAttendance_ValidationStage;
    @IsISO8601()
    @IsOptional()
    startDateTime?: Date;
    @IsISO8601()
    @IsOptional()
    endDateTime?: Date;
}