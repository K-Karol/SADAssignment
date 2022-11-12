import dotenv from 'dotenv';
import { User } from "../models/user";
import Role from "../models/role";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GenerateAPIResult, HttpException } from '../helpers';
import { Request, Response, NextFunction } from 'express';
import { LoginRequest, RegisterRequest } from '../validation/auth';
import { IJWTPayload } from '../interfaces/auth';
import { IUser } from '../interfaces/user';


export default class AdminController{
    public registerAdminUser = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const registerRequest: RegisterRequest = req.body;
             // hash the password
            registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

            const adminRole = await Role.findOne({name : "Admin"});
            if(!adminRole){
                throw new HttpException(500, "Failed to register user", undefined, new Error("Admin role not found"));
            return;
            }

            const newUser : IUser = {username: registerRequest.username, password: registerRequest.password, roles: [adminRole], address: registerRequest.address, fullname: registerRequest.fullname};

            // create a new user
            const user = await User.create(newUser);
            res.status(200).json(GenerateAPIResult(true, user._id));
        } catch(error){
            next(error);
        }
    }

}