import { Router } from 'express';
import UserController from '../controllers/user';
import { IRoute } from '../interfaces/routes';
import {AuthenticateRequest, AuthoriseByRoles} from '../middleware/auth';
 import ValidationMiddleware from '../middleware/validate';
// import { LoginRequest, RegisterRequest } from '../validation/auth';
import { GetUserByID_ValidationStage, GetUsersQuery, UserDecorated, UserPutRequest_ValidationStage } from '../validation/user';
export default class UserRoute implements IRoute {
  public path = '/users/';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}resource/`, AuthenticateRequest, AuthoriseByRoles(["Admin", "Staff"]), ValidationMiddleware(GetUsersQuery, 'query'),  this.userController.GetUsers);
    this.router.get(`${this.path}resource/:id`, AuthenticateRequest, AuthoriseByRoles(["Admin", "Staff"]), ValidationMiddleware(GetUserByID_ValidationStage, 'params'),  this.userController.GetUser);
    this.router.get(`${this.path}self`, AuthenticateRequest, this.userController.GetCurrentUser);
    this.router.post(`${this.path}resource/`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(UserDecorated, 'body'), this.userController.PostUser);
    this.router.put(`${this.path}resource/:id`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(GetUserByID_ValidationStage, 'params'), ValidationMiddleware(UserPutRequest_ValidationStage, 'body'), this.userController.UpdateUser);
    this.router.delete(`${this.path}resource/:id`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(GetUserByID_ValidationStage, 'params'),  this.userController.DeleteUser);
  }
}