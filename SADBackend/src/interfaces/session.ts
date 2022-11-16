import { Document, Types } from "mongoose";
import { ICohort, IModule } from "./module";
import { IUser } from "./user";

export interface IStudentWithAttendance {
    student: IUser | Types.ObjectId;
    attendance: string;
}

export interface ICohortWithAttendance {
    identifier: string;
    students: IStudentWithAttendance[];
}

export interface ISession{
    type: string;
    module: IModule | Types.ObjectId;
    cohort: ICohortWithAttendance;
    startDateTime: Date;
    endDateTime: Date;
}
