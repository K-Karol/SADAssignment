import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean, IsIn, IsDate, IsISO8601 } from "class-validator";
import { Schema, Types } from "mongoose";
import "reflect-metadata";


export class SessionPostRequest{
    @IsNotEmpty()
    @IsString()
    @IsIn(["lecture", "seminar"])
    type!: string;
    @IsNotEmpty()
    @IsString()
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

export class GetSessionForStudentParams{
    @IsNotEmpty()
    @IsString()
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