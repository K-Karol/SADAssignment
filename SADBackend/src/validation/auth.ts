import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IAddress, IFullname } from "../interfaces/user";
export class LoginRequest {
  @IsString()
  public username!: string;

  @IsString()
  public password!: string;

  
}

class FullNameDecorated implements IFullname{
  @IsString()
  firstname!: string;
  @IsString()
  @IsOptional()
  middlenames?: string;
  @IsString()
  lastname!: string;

}

class AddressDecorated implements IAddress{
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