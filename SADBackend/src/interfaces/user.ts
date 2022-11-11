export interface IFullname{
    firstname: string;
    middlenames?: string;
    lastname: string;
}

export interface IAddress{
    addressLine1: string;
    addressLine2?: string;
    addressLine3?: string;
    addressLine4?: string;
    postcode: string;
    city: string;
    country: string;
}

export interface IRole{
    name: string;
}

export interface IUser{
    username: string;
    password: string;
    roles: Array<IRole>;
    fullname: IFullname;
    address: IAddress;
}