import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from 'body-parser';
import cors from 'cors';
import bodyParse from 'body-parser'

import ErrorHandler from './middleware/error';
import AuthenticateRequest from './middleware/auth';
import {IAuthenticatedRequest} from './interfaces/auth';
import {GenerateAPIResult} from './helpers';
import compression from 'compression';
import ValidationMiddleware from './middleware/validate';
import Database from './database';
import { IRoute } from './interfaces/routes';
import AuthRoute from './routes/auth';
import { Logger } from "tslog";
import AdminRoute from './routes/admin';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import UserRoute from './routes/users';

import "reflect-metadata";
import CourseController from './controllers/course';
import CourseRoute from './routes/courses';
import SessionRoute from './routes/sessions';

// cleanup these imports

dotenv.config();

const log: Logger = new Logger({ name: "Index" });

const app: Express = express();
const routes: IRoute[] = [new AuthRoute(), new AdminRoute(), new UserRoute(), new CourseRoute(), new SessionRoute()];
//a
const {PORT = 5000, CORS_ORIGIN="https://localhost"} = process.env
const db: Database = new Database();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var corsOptions = {
  origin: CORS_ORIGIN
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(compression())

routes.forEach(route => {
  app.use('/api', route.router);
});
app.get("/api", (req, res) => {res.send("Root of the API")})

app.use(ErrorHandler);

const swaggerOptions = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: '3.0.2',
    info: {
      title: 'SADBackend REST API',
      description: "NodeJS + TypeScript API for the SAD Attendance System.",
      version: '1.0.0',
    },
  },
  apis: ['swagger.yaml'],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => log.info("Server is up and running"));

export default app;