import { Router } from 'express';
import UserController from '../controllers/user';
import { IRoute } from '../interfaces/routes';
import AuthenticateRequest from '../middleware/auth';
 import ValidationMiddleware from '../middleware/validate';
// import { LoginRequest, RegisterRequest } from '../validation/auth';
import { GetUserByID, GetUsersQuery, GetUsersQueryBody, UserDecorated, UserPutRequest } from '../validation/user';
export default class UserRoute implements IRoute {
  public path = '/users/';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthenticateRequest, ValidationMiddleware(GetUsersQuery, 'query'), ValidationMiddleware(GetUsersQueryBody, 'body'),  this.userController.GetUsers);
    this.router.get(`${this.path}:id`, AuthenticateRequest, ValidationMiddleware(GetUserByID, 'params'),  this.userController.GetUser);
    this.router.post(`${this.path}`, AuthenticateRequest, ValidationMiddleware(UserDecorated, 'body'), this.userController.PostUser);
    this.router.put(`${this.path}:id`, AuthenticateRequest, ValidationMiddleware(GetUserByID, 'params'), ValidationMiddleware(UserPutRequest, 'body'), this.userController.UpdateUser);
    this.router.delete(`${this.path}:id`, AuthenticateRequest, ValidationMiddleware(GetUserByID, 'params'),  this.userController.DeleteUser);
  }
}