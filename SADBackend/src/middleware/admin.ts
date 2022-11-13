import dotenv from 'dotenv';
import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import {GenerateAPIResult, HttpException} from '../helpers';
import { IJWTPayload, IAuthenticatedRequest} from '../interfaces/auth';
import {User} from "../models/user";
const AuthenticateAPIKeyRequest = async (req: Request, res: Response, next: NextFunction) => {
try{
    const APIKey = req.header('X-API-Key');
    if(!APIKey){
        next(new HttpException(404, "X-API-Key header missing", undefined));
        return;
    }

    const { ADMIN_APIKEY } = process.env;

    if(!ADMIN_APIKEY){
        next(new HttpException(500, "Internal server error", undefined, new Error("ADMIN_APIKEY .env value undefined")));
        return;
    }

    if(APIKey != ADMIN_APIKEY){
        next(new HttpException(401, 'Wrong API key', undefined));
        return;
    }

    next();
}
catch(error){

    if (typeof error === "string") {
        next(new HttpException(401, 'Wrong API key', undefined, new Error(error)));
    } else if (error instanceof Error) {
        next(new HttpException(401, 'Wrong API key', undefined, error));
    } else{
        next(new HttpException(401, 'Wrong API key', undefined));
    }

    
}
}

export default AuthenticateAPIKeyRequest;