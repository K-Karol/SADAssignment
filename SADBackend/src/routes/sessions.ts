import { Router } from 'express';
import SessionController from '../controllers/session';
import UserController from '../controllers/user';
import { IRoute } from '../interfaces/routes';
import {AuthenticateRequest, AuthoriseByRoles} from '../middleware/auth';
 import ValidationMiddleware from '../middleware/validate';
import { GetSessionForStudentBody, GetSessionForStudentParams, GetSessionsQuery, SessionPostRequest_Stage1 } from '../validation/session';
export default class SessionRoute implements IRoute {
  public path = '/sessions/';
  public router = Router();
  public sessionController = new SessionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}resource/`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(SessionPostRequest_Stage1, 'body'), this.sessionController.PostSession);
    this.router.get(`${this.path}GetSessionsForStudent/:studentID`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(GetSessionForStudentParams, 'params'), ValidationMiddleware(GetSessionsQuery, 'query'), ValidationMiddleware(GetSessionForStudentBody, 'body'), this.sessionController.GetAllSessionsForStudent);

    // this.router.get(`${this.path}resource/`, AuthenticateRequest, ValidationMiddleware(GetUsersQuery, 'query'), ValidationMiddleware(GetUsersQueryBody, 'body'),  this.userController.GetUsers);
    // this.router.get(`${this.path}resource/:id`, AuthenticateRequest, ValidationMiddleware(GetUserByID, 'params'),  this.userController.GetUser);
    // this.router.get(`${this.path}self`, AuthenticateRequest, this.userController.GetCurrentUser);
    // this.router.post(`${this.path}resource/`, AuthenticateRequest, ValidationMiddleware(UserDecorated, 'body'), this.userController.PostUser);
    // this.router.put(`${this.path}resource/:id`, AuthenticateRequest, ValidationMiddleware(GetUserByID, 'params'), ValidationMiddleware(UserPutRequest, 'body'), this.userController.UpdateUser);
    // this.router.delete(`${this.path}resource/:id`, AuthenticateRequest, ValidationMiddleware(GetUserByID, 'params'),  this.userController.DeleteUser);
  }
}