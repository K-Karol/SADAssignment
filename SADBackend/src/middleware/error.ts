import { NextFunction, Request, Response } from "express";
import { HttpException, IAPIResponse } from "../helpers";
import { Logger } from "tslog";

const ErrorHandler = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || "Something went wrong";

    const log: Logger = new Logger({ name: "ErrorHandlerMiddleware" });

    if (error instanceof HttpException) {
      log.error(
        `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`,
        error.Exception
      );
      const apiRespose: IAPIResponse = {
        Success: error.Success,
        Response: error.Response,
        Error: error.Error,
      };
      res.status(status).json(apiRespose as IAPIResponse);
    } else {
      log.error(
        `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`,
        error
      );
      const apiRespose: IAPIResponse = { Success: false, Error: message };
      res.status(status).json(apiRespose as IAPIResponse);
    }
  } catch (error) {
    next(error);
  }
};

export default ErrorHandler;
