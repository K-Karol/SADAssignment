import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean, IsIn, IsDate, IsISO8601 } from "class-validator";
import { Schema, Types } from "mongoose";
import "reflect-metadata";
import { Module } from "../models/module";
import { User } from "../models/user";
import { DoesObjectIdExist, IsArrayOfMongooseObjectId, IsMongooseObjectId } from "./custom-decorators";

export class SessionPostRequest_Stage1{
    @IsNotEmpty()
    @IsString()
    @IsIn(["lecture", "seminar"])
    type!: string;
    @DoesObjectIdExist(Module)
    @IsMongooseObjectId()
    @IsNotEmpty()
    module!: string;
    @IsString()
    @IsNotEmpty()
    cohortIdentifier!: string;
    @IsNotEmpty()
    @IsISO8601()
    startDateTime!: Date;
    @IsNotEmpty()
    @IsISO8601()
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