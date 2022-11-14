import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean, IsIn, IsDate, IsISO8601 } from "class-validator";
import { Schema, Types } from "mongoose";
import "reflect-metadata";


export class PostModuleRequest{
    name!: string;
    year!: string;
}