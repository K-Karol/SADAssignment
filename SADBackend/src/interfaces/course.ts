import { Document, Types } from "mongoose";
import { IModule } from "./module";
import { IUser } from "./user";

export interface ICourse{
    name: string,
    yearOfEntry: string,
    courseLeader: IUser | Types.ObjectId,
    modules: IModule[] | Types.ObjectId[],
    students: IUser[] | Types.ObjectId[]
}