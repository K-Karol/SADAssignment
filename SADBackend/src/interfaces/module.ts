import { ObjectId, Document} from "mongoose";
import { IUser } from "./user";

export interface ICohort{
    identifier: string;
    students: IUser[] | ObjectId[];
}

export interface IModule{
    name: string;
    year: string;
    semester: string;
    students: IUser[] | ObjectId[];
    cohorts: ICohort[];
    moduleLeader: IUser | ObjectId;
    instructors : IUser[] | ObjectId[];
}