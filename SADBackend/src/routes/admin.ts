import { Router } from 'express';
import AdminController from '../controllers/admin';
import UserController from '../controllers/user';
import { IRoute } from '../interfaces/routes';
import AuthenticateAPIKeyRequest from '../middleware/admin';
import ValidationMiddleware from '../middleware/validate';
import { LoginRequest, RegisterRequest } from '../validation/auth';
import { UserDecorated } from '../validation/user';

export default class AdminRoute implements IRoute {
  public path = '/admin/';
  public router = Router();
  public adminController = new AdminController();
  public userController = new UserController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}createAdminUser`, AuthenticateAPIKeyRequest, ValidationMiddleware(RegisterRequest, 'body'), this.adminController.registerAdminUser);
    this.router.post(`${this.path}users/`,  AuthenticateAPIKeyRequest, ValidationMiddleware(UserDecorated, 'body'), this.userController.PostUser);
    // this.router.post(`${this.path}`, ValidationMiddleware(LoginRequest, 'body'), this.authController.login);
  }
}