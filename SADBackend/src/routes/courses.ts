import { Router } from 'express';
import CourseController from '../controllers/course';
import { IRoute } from '../interfaces/routes';
import AuthenticateRequest from '../middleware/auth';
 import ValidationMiddleware from '../middleware/validate';
import { GetCoursesQuery, GetCoursesQueryBody, PostCourse } from '../validation/course';
export default class CourseRoute implements IRoute {
  public path = '/courses/';
  public router = Router();
  public courseController = new CourseController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}resource/`, AuthenticateRequest, ValidationMiddleware(GetCoursesQuery, 'query'), ValidationMiddleware(GetCoursesQueryBody, 'body'),  this.courseController.GetCourses);
    // this.router.get(`${this.path}:id`, AuthenticateRequest, ValidationMiddleware(GetUserByID, 'params'),  this.userController.GetUser);
     this.router.post(`${this.path}resource/`, ValidationMiddleware(PostCourse, 'body'), this.courseController.PostCourse);
  }
}