import { Request } from 'express';
import { IUser } from './user';
export interface IJWTPayload{
    UserID: String;    
}

export interface IAuthenticatedRequest extends Request{
    User?: IUser
}

