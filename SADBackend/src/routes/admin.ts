import { Router } from 'express';
import AdminController from '../controllers/admin';
import CourseController from '../controllers/course';
import ModuleController from '../controllers/module';
import UserController from '../controllers/user';
import { IRoute } from '../interfaces/routes';
import AuthenticateAPIKeyRequest from '../middleware/admin';
import ValidationMiddleware from '../middleware/validate';
import { LoginRequest, RegisterRequest } from '../validation/auth';
import { PostCourse_ValidationStage } from '../validation/course';
import { PostModuleRequest_ValidationStage } from '../validation/module';
import { UserDecorated } from '../validation/user';

export default class AdminRoute implements IRoute {
  public path = '/admin/';
  public router = Router();
  public adminController = new AdminController();
  public userController = new UserController();
  public moduleController = new ModuleController();
  public courseController = new CourseController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}createAdminUser`, AuthenticateAPIKeyRequest, ValidationMiddleware(RegisterRequest, 'body'), this.adminController.registerAdminUser);
    this.router.post(`${this.path}users/`,  AuthenticateAPIKeyRequest, ValidationMiddleware(UserDecorated, 'body'), this.userController.PostUser);
    this.router.post(`${this.path}modules/`, AuthenticateAPIKeyRequest, ValidationMiddleware(PostModuleRequest_ValidationStage, 'body'), this.moduleController.PostModule);    // this.router.post(`${this.path}`, ValidationMiddleware(LoginRequest, 'body'), this.authController.login);
    this.router.post(`${this.path}courses/`, AuthenticateAPIKeyRequest, ValidationMiddleware(PostCourse_ValidationStage, 'body'), this.courseController.PostCourse);

  }
}