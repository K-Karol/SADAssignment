import {  Document, Types} from "mongoose";
import { IUser } from "./user";

export interface ICohort{
    identifier: string;
    students: IUser[] | Types.ObjectId[];
}

export interface IModule{
    name: string;
    year: string;
    semester: string;
    students: IUser[] | Types.ObjectId[];
    cohorts: ICohort[];
    moduleLeader: IUser | Types.ObjectId;
    instructors : IUser[] | Types.ObjectId[];
}