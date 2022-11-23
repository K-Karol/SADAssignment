import { Router } from 'express';
import ModuleController from '../controllers/module';
import { IRoute } from '../interfaces/routes';
import {AuthenticateRequest, AuthoriseByRoles} from '../middleware/auth';
 import ValidationMiddleware from '../middleware/validate';
import { GetModuleByID_ValidationStage, GetModulesQuery, GetModulesQueryBody, ModulePutRequest_ValidationStage, PostModuleRequest_ValidationStage } from '../validation/module';
export default class ModuleRoute implements IRoute {
  public path = '/modules/';
  public router = Router();
  public moduleController = new ModuleController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}resource/`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(PostModuleRequest_ValidationStage, 'body'), this.moduleController.PostModule);
    //this.router.get(`${this.path}GetSessionsForStudent/:studentID`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(GetSessionForStudentParams, 'params'), ValidationMiddleware(GetSessionsQuery, 'query'), ValidationMiddleware(GetSessionForStudentBody, 'body'), this.sessionController.GetAllSessionsForStudent);
    this.router.get(`${this.path}resource/`, AuthenticateRequest, AuthoriseByRoles(["Admin", "Staff"]), ValidationMiddleware(GetModulesQuery, 'query'), ValidationMiddleware(GetModulesQueryBody, 'body'),  this.moduleController.GetModules);
    this.router.delete(`${this.path}resource/:id`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(GetModuleByID_ValidationStage, 'params'),  this.moduleController.DeleteModule);
    this.router.put(`${this.path}resource/:id`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(GetModuleByID_ValidationStage, 'params'), ValidationMiddleware(ModulePutRequest_ValidationStage, 'body'), this.moduleController.UpdateModule);

    // this.router.get(`${this.path}resource/:id`, AuthenticateRequest, ValidationMiddleware(GetUserByID, 'params'),  this.userController.GetUser);
    // this.router.get(`${this.path}self`, AuthenticateRequest, this.userController.GetCurrentUser);
    // this.router.post(`${this.path}resource/`, AuthenticateRequest, ValidationMiddleware(UserDecorated, 'body'), this.userController.PostUser);
    // this.router.put(`${this.path}resource/:id`, AuthenticateRequest, ValidationMiddleware(GetUserByID, 'params'), ValidationMiddleware(UserPutRequest, 'body'), this.userController.UpdateUser);
    // this.router.delete(`${this.path}resource/:id`, AuthenticateRequest, ValidationMiddleware(GetUserByID, 'params'),  this.userController.DeleteUser);
  }
}