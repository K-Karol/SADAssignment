import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean } from "class-validator";
import { Module } from "../models/module";
import { PipelineStage, Schema, Types } from "mongoose";
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

export class PostCourse{
    @IsNotEmpty()
    @IsString()
    name! : string;
    @IsNotEmpty()
    @IsString()
    yearOfEntry! : string;
    @IsNotEmpty()
    @IsMongooseObjectId()
    @Type(() => Types.ObjectId)
    @DoesObjectIdExist(User)
    courseLeader!: Types.ObjectId;
    @IsNotEmpty()
    @IsArrayOfMongooseObjectId()
    @Type(() => Types.ObjectId)
    @DoesArrayOfObjectIdExist(Module)
    modules!: Types.ObjectId[];
    @IsOptional()
    @IsArrayOfMongooseObjectId()
    @Type(() => Types.ObjectId)
    @DoesArrayOfObjectIdExist(User)
    students?: Types.ObjectId[];
}

export class GetCourseByID{
    @IsNotEmpty()
    @IsMongooseObjectId()
    @Type(() => Types.ObjectId)
    @DoesObjectIdExist(Course)
    id!: Types.ObjectId;
}

export class CoursePutRequest{
    @IsString()
    @IsOptional()
    name?: string;
    @IsString()
    @IsOptional()
    yearOfEntry?: string;
    @IsOptional()
    @IsMongooseObjectId()
    @Type(() => Types.ObjectId)
    courseLeader?: Types.ObjectId;
    @IsOptional()
    @IsArrayOfMongooseObjectId()
    @Type(() => Types.ObjectId)
    modules?: Types.ObjectId[];
    @IsOptional()
    @IsArrayOfMongooseObjectId()
    @Type(() => Types.ObjectId)
    students?: Types.ObjectId[];
}

