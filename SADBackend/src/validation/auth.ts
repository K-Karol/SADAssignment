import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IAddress, IFullname } from "../interfaces/user";
import { AddressDecorated, FullNameDecorated } from "./user";
export class LoginRequest {
  @IsString()
  public username!: string;

  @IsString()
  public password!: string;

  
}

export class RegisterRequest {
  @IsString()
    username!: string;
    @IsString()
    password!: string;
    @IsNotEmpty()
    fullname!: FullNameDecorated
    @IsNotEmpty()
    address!: AddressDecorated;
}