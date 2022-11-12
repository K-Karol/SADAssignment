import { ObjectId, Document } from "mongoose";
import { IModule } from "./module";
import { IUser } from "./user";

export interface ICourse{
    name: string,
    yearOfEntry: string,
    courseLeader: IUser | ObjectId,
    modules: IModule[] | ObjectId[],
    students: IUser[] | ObjectId[]
}