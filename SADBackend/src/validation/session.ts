import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean, IsIn, IsDate, IsISO8601 } from "class-validator";
import { Schema, Types } from "mongoose";
import "reflect-metadata";
import { IsArrayOfMongooseObjectId, IsMongooseObjectId } from "./custom-decorators";

export class SessionPostRequest{
    @IsNotEmpty()
    @IsString()
    @IsIn(["lecture", "seminar"])
    type!: string;
    @IsNotEmpty()
    @IsMongooseObjectId()
    @Type(() => Types.ObjectId)
    module!: Types.ObjectId;
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

export class GetSessionForStudentParams{
    @IsNotEmpty()
    @IsMongooseObjectId()
    @Type(() => Types.ObjectId)
    studentID!: Types.ObjectId
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