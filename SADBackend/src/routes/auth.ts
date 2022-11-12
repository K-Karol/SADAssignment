import { Router } from 'express';
import AuthController from '../controllers/auth';
import { IRoute } from '../interfaces/routes';
import AuthenticateRequest from '../middleware/auth';
import ValidationMiddleware from '../middleware/validate';
import { LoginRequest, RegisterRequest } from '../validation/auth';
export default  class AuthRoute implements IRoute {
  public path = '/auth/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.post(`${this.path}register`, ValidationMiddleware(RegisterRequest, 'body'), this.authController.register);
    this.router.post(`${this.path}login`, ValidationMiddleware(LoginRequest, 'body'), this.authController.login);
  }
}