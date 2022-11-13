import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean } from "class-validator";
import { PipelineStage, Schema } from "mongoose";
import "reflect-metadata";

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
    @IsString()
    name! : string;
    @IsString()
    yearOfEntry! : string;
    @IsString()
    courseLeader!: string;
    @IsNotEmpty()
    modules!: string[];
    @IsOptional()
    students?: string[];
}