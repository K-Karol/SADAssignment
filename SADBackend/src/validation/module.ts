import { plainToInstance, Transform, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean, IsIn, IsDate, IsISO8601 } from "class-validator";
import { Schema, Types } from "mongoose";
import "reflect-metadata";
import { Module } from "../models/module";
import { User } from "../models/user";
import { IsArrayOfMongooseObjectId, DoesArrayOfObjectIdExist, IsMongooseObjectId, DoesObjectIdExist} from "./custom-decorators";

export class Cohort_ControllerStage{
    identifier!: string;
    @Transform(({value}) => (value as Array<string>).map((v) => new Types.ObjectId(v)))
    students!: Types.ObjectId[]
}

export class Cohort_ValidationStage {
    @IsString()
    @IsNotEmpty()
    identifier!: string;
    @DoesArrayOfObjectIdExist(User)
    @IsArrayOfMongooseObjectId()
    @IsNotEmpty()
    students!: string[]
}

export class PostModuleRequest_ControllerStage{
    name!: string;
    year!: string;
    semester!: string;
    @Transform(({value}) => (value as Array<string>).map((v) => new Types.ObjectId(v)))
    students!: Types.ObjectId[];
    @Transform(({value}) => plainToInstance(Cohort_ControllerStage, value, {}))
    cohorts!: Cohort_ControllerStage[];
    @Transform(({value}) => new Types.ObjectId(value))
    moduleLeader!: Types.ObjectId;
    @Transform(({value}) => (value as Array<string>).map((v) => new Types.ObjectId(v)))
    instructors!: Types.ObjectId[];
}

export class PostModuleRequest_ValidationStage{
    @IsString()
    @IsNotEmpty()
    name!: string;
    @IsString()
    @IsNotEmpty()
    year!: string;
    @IsString()
    @IsNotEmpty()
    semester!: string;
    @DoesArrayOfObjectIdExist(User)
    @IsArrayOfMongooseObjectId()
    @IsNotEmpty()
    students!: string[];
    @IsNotEmpty()
    cohorts!: Cohort_ValidationStage[];
    @DoesObjectIdExist(User)
    @IsMongooseObjectId()
    @IsNotEmpty()
    moduleLeader!: string;
    @DoesArrayOfObjectIdExist(User)
    @IsArrayOfMongooseObjectId()
    @IsNotEmpty()
    instructors!: string[];
}

export class GetModulesQuery{
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    page?: number;
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    limit?: number;
}

export class GetModulesQueryBody{
    @IsOptional()
    @Type(() => Object)
    filter?: object;

    @IsBoolean()
    @IsOptional()
    joinStudents?: boolean;

    @IsBoolean()
    @IsOptional()
    joinStaff?: boolean;

}

export class GetModuleByID_ControllerStage{
    @Transform(({value}) => new Types.ObjectId(value))
    id!: Types.ObjectId;
}

export class GetModuleByID_ValidationStage{
    @DoesObjectIdExist(Module)
    @IsMongooseObjectId()
    @IsNotEmpty()
    id!: string;
}

export class ModulePutRequest_ControllerStage{
    name?: string;
    year?: string;
    semester?: string;
    @Transform(({value}) => (value as Array<string>).map((v) => new Types.ObjectId(v)))
    students?: Types.ObjectId[];
    @Transform(({value}) => plainToInstance(Cohort_ControllerStage, value, {}))
    cohorts?: Cohort_ControllerStage[];
    @Transform(({value}) => new Types.ObjectId(value))
    moduleLeader?: Types.ObjectId;
    @Transform(({value}) => (value as Array<string>).map((v) => new Types.ObjectId(v)))
    instructors?: Types.ObjectId[];
}

export class ModulePutRequest_ValidationStage{
    @IsString()
    @IsOptional()
    name?: string;
    @IsString()
    @IsOptional()
    year?: string;
    @IsString()
    @IsOptional()
    semester?: string;
    @DoesArrayOfObjectIdExist(User)
    @IsArrayOfMongooseObjectId()
    @IsOptional()
    students?: string[];
    @IsOptional()
    cohorts?: Cohort_ValidationStage[];
    @DoesObjectIdExist(User)
    @IsMongooseObjectId()
    @IsOptional()
    moduleLeader?: string;
    @DoesArrayOfObjectIdExist(User)
    @IsArrayOfMongooseObjectId()
    @IsOptional()
    instructors?: string[];
}