import { Document, Types } from "mongoose";
import { ISession } from "./session";

export interface IActiveSession{
    session: ISession | Types.ObjectId;
    code: string;
}
