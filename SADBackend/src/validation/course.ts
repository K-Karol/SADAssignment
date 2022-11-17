import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean } from "class-validator";
import { Module } from "../models/module";
import { BooleanSchemaDefinition, PipelineStage, Schema, Types } from "mongoose";
import "reflect-metadata";
import { Course } from "../models/course";
import { DoesArrayOfObjectIdExist, DoesObjectIdExist, IsArrayOfMongooseObjectId, IsMongooseObjectId } from "./custom-decorators";
import { User } from "../models/user";
import { ICourse } from "../interfaces/course";

export class GetCoursesQueryBody{
    @IsOptional()
    @Type(() => Object)
    filter?: object

    @IsBoolean()
    @IsOptional()
    joinStudents?: boolean;

    @IsBoolean()
    @IsOptional()
    joinModules?: boolean;
}

export class GetCoursesQuery{
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    page?: number;
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    limit?: number;
}

export class PostCourse_ControllerStage{
    name! : string;
    yearOfEntry! : string;
    @Transform(({value}) => new Types.ObjectId(value))
    courseLeader!: Types.ObjectId;
    @Transform(({value}) => (value as Array<string>).map((v) => new Types.ObjectId(v)))
    modules!: Types.ObjectId[];
    @Transform(({value}) => (value as Array<string>).map((v) => new Types.ObjectId(v)))
    students?: Types.ObjectId[];
}

export class PostCourse_ValidationStage{
    @IsNotEmpty()
    @IsString()
    name! : string;
    @IsNotEmpty()
    @IsString()
    yearOfEntry! : string;
    @DoesObjectIdExist(User)
    @IsMongooseObjectId()
    @IsNotEmpty()
    courseLeader!: string;
    @DoesArrayOfObjectIdExist(Module)
    @IsArrayOfMongooseObjectId()
    @IsNotEmpty()
    modules!: string[];
    @DoesArrayOfObjectIdExist(User)
    @IsArrayOfMongooseObjectId()
    @IsOptional()
    students?: string[];
}

export class GetCourseByID_ControllerStage{
    @Transform(({value}) => new Types.ObjectId(value))
    id!: Types.ObjectId;
}

export class GetCourseByID_ValidationStage{
    @DoesObjectIdExist(Course)
    @IsMongooseObjectId()
    @IsNotEmpty()
    id!: string;
}

export class CoursePutRequest_ControllerStage{
    name?: string;
    yearOfEntry?: string;
    @Transform(({value}) => new Types.ObjectId(value))
    courseLeader?: Types.ObjectId;
    @Transform(({value}) => (value as Array<string>).map((v) => new Types.ObjectId(v)))
    modules?: Types.ObjectId[];
    @Transform(({value}) => (value as Array<string>).map((v) => new Types.ObjectId(v)))
    students?: Types.ObjectId[];
}

export class CoursePutRequest_ValidationStage{
    @IsString()
    @IsOptional()
    name?: string;
    @IsString()
    @IsOptional()
    yearOfEntry?: string;
    @DoesObjectIdExist(User)
    @IsMongooseObjectId()
    @IsOptional()
    courseLeader?: string;
    @DoesArrayOfObjectIdExist(Module)
    @IsArrayOfMongooseObjectId()
    @IsOptional()
    modules?: string[];
    @DoesArrayOfObjectIdExist(User)
    @IsArrayOfMongooseObjectId()
    @IsOptional()
    students?: string[];
}

