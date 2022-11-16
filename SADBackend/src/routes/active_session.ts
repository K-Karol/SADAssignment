import { Router } from 'express';
import ActiveSessionController from '../controllers/active_session';
import { IRoute } from '../interfaces/routes';
import {AuthenticateRequest, AuthoriseByRoles} from '../middleware/auth';
 import ValidationMiddleware from '../middleware/validate';
import { CreateNewActiveSessionRequest_ValidationStage } from '../validation/active_session';
export default class ActiveSessionRoute implements IRoute {
  public path = '/activeSessions/';
  public router = Router();
  public activeSessionController = new ActiveSessionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}GenerateNewActiveSession/:sessionID`, AuthenticateRequest, AuthoriseByRoles(["Admin", "Staff"]), ValidationMiddleware(CreateNewActiveSessionRequest_ValidationStage, 'params'), this.activeSessionController.GenerateNewActiveSession);
  }
}