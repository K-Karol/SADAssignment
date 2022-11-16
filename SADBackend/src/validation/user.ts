import { Transform, TransformInstanceToInstance, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean, IsArray } from "class-validator";
import { Schema, Types } from "mongoose";
import "reflect-metadata";
import { IAddress, IFullname, IRole, IUser } from "../interfaces/user";
import Role from "../models/role";
import { DoesArrayOfObjectIdExist, IsArrayOfMongooseObjectId, IsMongooseObjectId } from "./custom-decorators";

export class GetUsersQuery{
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    page?: number;
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    limit?: number;
}

export class FullNameDecorated implements IFullname{
    @IsString()
    firstname!: string;
    @IsString()
    @IsOptional()
    middlenames?: string;
    @IsString()
    lastname!: string;
  
  }
  
export class AddressDecorated implements IAddress{
    @IsString()
    addressLine1!: string;
    @IsString()
    @IsOptional()
    addressLine2?: string | undefined;
    @IsString()
    @IsOptional()
    addressLine3?: string | undefined;
    @IsString()
    @IsOptional()
    addressLine4?: string | undefined;
    @IsString()
    postcode!: string;
    @IsString()
    city!: string;
    @IsString()
    country!: string;
}

export class UserDecorated{
    @IsString()
    @IsNotEmpty()
    username!: string;
    @IsString()
    password!: string;
    @IsNotEmpty()
    fullname!: FullNameDecorated;
    @IsNotEmpty()
    address!: AddressDecorated;

}


export class UserPutRequest_ControllerStage{
    @Transform(({value}) => (value as Array<string>).map((v) => new Types.ObjectId(v)))
    roles?: Types.ObjectId[];
    fullname?: FullNameDecorated;
    address?: AddressDecorated;

}

export class UserPutRequest_ValidationStage{
    @DoesArrayOfObjectIdExist(Role)
    @IsArrayOfMongooseObjectId()
    @IsOptional()
    roles?: string[];
    @IsOptional()
    fullname?: FullNameDecorated;
    @IsOptional()
    address?: AddressDecorated;

}

class AddressDelta {
    @IsString()
    @IsOptional()
    addressLine1?: string;
    @IsString()
    @IsOptional()
    addressLine2?: string;
    @IsString()
    @IsOptional()
    addressLine3?: string;
    @IsString()
    @IsOptional()
    addressLine4?: string;
    @IsString()
    @IsOptional()
    postcode?: string;
    @IsString()
    @IsOptional()
    city?: string;
    @IsString()
    @IsOptional()
    country?: string;
}


class FullNameDelta{
    @IsString()
    @IsOptional()
    firstname?: string;
    @IsString()
    @IsOptional()
    middlenames?: string;
    @IsString()
    @IsOptional()
    lastname!: string;
}

export class GetUserByID_ValidationStage{
    @IsNotEmpty()
    @IsMongooseObjectId()
    id!: string;
}


export class GetUserByID_ControllerStage{
    @Transform(({value}) => new Types.ObjectId(value))
    id!: Types.ObjectId;
}




export class GetUsersQueryBody{
    @IsOptional()
    @Type(() => Object)
    filter?: object

    @IsBoolean()
    @IsOptional()
    joinCourses?: boolean;

    @IsBoolean()
    @IsOptional()
    joinModules?: boolean;

}