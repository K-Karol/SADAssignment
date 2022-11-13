import dotenv from 'dotenv';
import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import {GenerateAPIResult, HttpException} from '../helpers';
import { IJWTPayload, IAuthenticatedRequest} from '../interfaces/auth';
import {User} from "../models/user";
const AuthenticateRequest = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
try{
    const AuthorizationHeader = req.header('Authorization');
    if(!AuthorizationHeader){
        next(new HttpException(404, "Authorization header missing", undefined));
        return;
    }
    const token = AuthorizationHeader.split('Bearer ')[1];
    if(!token){
        next(new HttpException(404, "Authorization token missing", undefined));
        return;
    }

    const {SECRET} = process.env

    if(!SECRET){
        next(new HttpException(500, "Internal server error", undefined, new Error("SECRET .env value undefined")));
        return;
    }

    const payload = (await jwt.verify(token, SECRET)) as IJWTPayload;
    const user = await User.findOne({ _id: payload.UserID }).populate("roles");
    if(user){
        req.User = user;
        next();
    } else{
        next(new HttpException(401, 'Wrong authentication token', undefined));
    }
}
catch(error){

    if (typeof error === "string") {
        next(new HttpException(401, 'Wrong authentication token', undefined, new Error(error)));
    } else if (error instanceof Error) {
        next(new HttpException(401, 'Wrong authentication token', undefined, error));
    } else{
        next(new HttpException(401, 'Wrong authentication token', undefined));
    }

    
}
}

export default AuthenticateRequest;
// const resGen = require("../apiResponse");
// const {User} = require("../models/user");

// // auth middleware. Use this during routing to make sure the request is properly authorised.
// const authenticateRequest = async (req, res, next) => {
//   try {
//     if (req.headers.authorization) {
//       const token = req.headers.authorization.split(" ")[1]; //split the header and get the token
//       if (token) {
//         const payload = await jwt.verify(token, process.env.SECRET);
//         if (payload) {
//           User.findOne({ _id: payload.userId }).populate("roles").exec((err, usr) => {
//             if (err) {
//               res.status(401).json(
//                   resGen.generateResult(
//                     false,
//                     false,
//                     "User not found"
//                   )
//                 );
//                 return;
//             }
//             req.user = usr;
//             next();

//           });
//         } else {
//           res
//             .status(401)
//             .json(
//               resGen.generateResult(false, false, "Token verification failed")
//             );
//         }
//       } else {
//         res
//           .status(401)
//           .json(resGen.generateResult(false, false, "Malformed auth header"));
//       }
//     } else {
//       res
//         .status(401)
//         .json(resGen.generateResult(false, false, "No authorization header"));
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(401).json(resGen.generateResult(false, false, error));
//   }
// };

// const checkRoles = (roles) => {
//   return async (req, res, next) => {
//     if (!req.user) {
//       res
//         .status(500)
//         .json(resGen.generateResult(false, false, "Failed to check role"));
//       return;
//     }

//     const found = req.user.roles.some((r) => roles.includes(r.name));
//       if (found) {
//         next();
//         return;
//       } else {
//         res
//           .status(401)
//           .json(resGen.generateResult(false, false, "You are not authorised"));
//       }
    
//   };
// };
// module.exports = {
//   authenticateRequest,
//   checkRoles,
// };
