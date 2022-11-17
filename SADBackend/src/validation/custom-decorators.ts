import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { isValidObjectId, Model, Types } from 'mongoose';

export function IsMongooseObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMongooseObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && isValidObjectId(value); // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}

export function IsArrayOfMongooseObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsArrayOfMongooseObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value instanceof Array<String> && value.every((v) => isValidObjectId(v)); // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}


export function DoesObjectIdExist(model: Model<any>, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'DoesObjectIdExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model],
      validator: {
        async validate(value: string, args: ValidationArguments) {
          const model = args.constraints[0];
          var foundDoc = await model.findOne({_id : value});
          return foundDoc != undefined; // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}


export function DoesArrayOfObjectIdExist(model: Model<any>, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'DoesArrayOfObjectIdExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model],
      validator: {
        async validate(value: Types.ObjectId[], args: ValidationArguments) {
          const model = args.constraints[0];
          
          return (await Promise.all(value.map(async (v) => (await model.findOne({_id : value})) != undefined))).every((v) => v);
          
        },
      },
    });
  };
}
