import dotenv from 'dotenv';
import { NextFunction, Response, Request, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { GenerateAPIResult, HttpException } from '../helpers';
import { IJWTPayload, IAuthenticatedRequest } from '../interfaces/auth';
import { IRole } from '../interfaces/user';
import { User } from "../models/user";
export const AuthenticateRequest = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const AuthorizationHeader = req.header('Authorization');
        if (!AuthorizationHeader) {
            next(new HttpException(404, "Authorization header missing", undefined));
            return;
        }
        const token = AuthorizationHeader.split('Bearer ')[1];
        if (!token) {
            next(new HttpException(404, "Authorization token missing", undefined));
            return;
        }

        const { SECRET } = process.env;

        if (!SECRET) {
            next(new HttpException(500, "Internal server error", undefined, new Error("SECRET .env value undefined")));
            return;
        }

        const payload = (await jwt.verify(token, SECRET)) as IJWTPayload;
        const user = await User.findOne({ _id: payload.UserID }).populate("roles");
        if (user) {
            req.User = user;
            next();
        } else {
            next(new HttpException(401, 'Wrong authentication token', undefined));
        }
    }
    catch (error) {

        if (typeof error === "string") {
            next(new HttpException(401, 'Wrong authentication token', undefined, new Error(error)));
        } else if (error instanceof Error) {
            next(new HttpException(401, 'Wrong authentication token', undefined, error));
        } else {
            next(new HttpException(401, 'Wrong authentication token', undefined));
        }


    }
}

export const AuthoriseByRoles = (
    roles: string[]
  ): RequestHandler => {
    return (req : IAuthenticatedRequest, res: Response, next: NextFunction) => {
        try{
            if(!req.User!.roles.some((r) => roles.includes((r as IRole).name))){
                throw new HttpException(403, "You are forbidden from accessing this resource", undefined, new Error(`${req.User!.username} attempted to access ${req.originalUrl} which requires the following roles: ${roles}`))
            };
            next();
        } catch(err){
            next(err);
        }
    };
  };