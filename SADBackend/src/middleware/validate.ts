import { plainToInstance } from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { RequestHandler } from 'express';
import { HttpException } from '../helpers';

class ValidatorOptionsImpl implements ValidatorOptions{
  
}

const ValidationMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req, res, next) => {
    const valOpts: ValidatorOptionsImpl = {skipMissingProperties: skipMissingProperties, whitelist: whitelist, forbidNonWhitelisted: forbidNonWhitelisted, stopAtFirstError: true};
    validate(plainToInstance(type, (req as any)[value]), valOpts).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error: ValidationError) => error.toString()).join(', ');
        next(new HttpException(400, message));
      } else {
        next();
      }
    });
  };
};

export default ValidationMiddleware;
