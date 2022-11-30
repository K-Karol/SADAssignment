import { Router } from 'express';
import CourseController from '../controllers/course';
import { IRoute } from '../interfaces/routes';
import {AuthenticateRequest, AuthoriseByRoles} from '../middleware/auth';
 import ValidationMiddleware from '../middleware/validate';
import { CoursePutRequest_ValidationStage, GetCourseByID_ValidationStage, GetCoursesQuery, PostCourse_ValidationStage } from '../validation/course';
export default class CourseRoute implements IRoute {
  public path = '/courses/';
  public router = Router();
  public courseController = new CourseController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}resource/`, AuthenticateRequest, AuthoriseByRoles(["Admin", "Staff"]), ValidationMiddleware(GetCoursesQuery, 'query'), this.courseController.GetCourses);
    this.router.get(`${this.path}GetMyCourses`, AuthenticateRequest, AuthoriseByRoles(["Admin", "Staff"]), ValidationMiddleware(GetCoursesQuery, 'query'), this.courseController.GetMyCourses)
    // this.router.get(`${this.path}:id`, AuthenticateRequest, ValidationMiddleware(GetUserByID, 'params'),  this.userController.GetUser);
    this.router.post(`${this.path}resource/`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(PostCourse_ValidationStage, 'body'), this.courseController.PostCourse);
    this.router.get(`${this.path}resource/:id`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(GetCourseByID_ValidationStage, 'params'),  this.courseController.GetCourse);
    this.router.put(`${this.path}resource/:id`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(GetCourseByID_ValidationStage, 'params'), ValidationMiddleware(CoursePutRequest_ValidationStage, 'body'), this.courseController.UpdateCourse);
    this.router.delete(`${this.path}resource/:id`, AuthenticateRequest, AuthoriseByRoles(["Admin"]), ValidationMiddleware(GetCourseByID_ValidationStage, 'params'),  this.courseController.DeleteCourse);

  }
}