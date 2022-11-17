import { Request } from 'express';
import { IUser } from './user';
import {User} from "../models/user"
export interface IJWTPayload{
    UserID: String;    
}

export interface IAuthenticatedRequest extends Request{
    User?: typeof User | IUser
}

