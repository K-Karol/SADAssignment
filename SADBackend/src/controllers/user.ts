import { Request, Response, NextFunction } from "express";
import {
  User,
  UserPaginate,
  BaseExcludes as UserBaseExcludes,
} from "../models/user";
import { AggregatePaginateModel, isValidObjectId } from "mongoose";
import { IUser } from "../interfaces/user";
import { GenerateAPIResult, HttpException } from "../helpers";
import { GetUserByID, UserDecorated } from "../validation/user";
import bcrypt from "bcryptjs";
// import {aggregate} from 'mongoose-aggregate-paginate-v2';

export default class UserController {
  public PostUser = async (req: Request, res: Response, next: NextFunction) => {
    const postRequest: UserDecorated = req.body;

    try {
      postRequest.password = await bcrypt.hash(req.body.password, 10);
      const userParsed: IUser = {
        username: postRequest.username,
        password: postRequest.password,
        address: postRequest.address,
        fullname: postRequest.fullname,
        roles: [],
      };
      const newUser = new User(userParsed);
      const user = await newUser.save();
      res.status(200).json(GenerateAPIResult(true, newUser._id, undefined));
    } catch (err) {
      next(err);
    }
  };

  public GetUsers = async (req: Request, res: Response, next: NextFunction) => {
    let aggregate_options = [];

    var temp = req.query.page;

    let page = 1;
    let limit = 20;

    if (req.query.page) {
      page = parseInt(req.query.page as string);
    }

    if (req.query.limit) {
      limit = parseInt(req.query.limit as string);
    }

    const options = {
      page,
      limit,
      collation: { locale: "en" },
      customLabels: {
        totalDocs: "totalResults",
        docs: "users",
      },
    };

    UserBaseExcludes.forEach((element) => {
      aggregate_options.push({ $project: element });
    });

    aggregate_options.push({
      $lookup: {
        from: "roles",
        localField: "roles",
        foreignField: "_id",
        as: "roles",
      },
    });

    const myAggregate = UserPaginate.aggregate(aggregate_options);

    UserPaginate.aggregatePaginate(myAggregate, options)
      .then((result) => res.status(200).json(GenerateAPIResult(true, result)))
      .catch((err) => {
        console.log(err);
        res.status(500).json(GenerateAPIResult(false, undefined, err));
      });
  };

  public GetUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      var params: GetUserByID = (req as any)["params"];

      if (!isValidObjectId(params.id)) {
        throw new HttpException(400, "ID is not in the valid format");
      }

      const user = await User.findById(
        params.id,
        { password: 0 },
        { populate: "roles" }
      );

      if (!user) throw new HttpException(400, "User not found");

      res.status(200).json(GenerateAPIResult(true, user, undefined));

    } catch (err) {
      next(err);
    }
  };
}
