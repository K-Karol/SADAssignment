export interface IAPIResponse {
    Success: boolean;
    Response?: object | string;
    Error?: object | string;
}

export class APIResponse implements IAPIResponse {
    Success: boolean = false;
    Response?: object | string;
    Error?: object| string;
}

export class HttpException extends Error implements IAPIResponse {
    status: number;
    Success: boolean = false;
    Response?: object | string;
    Error: object | string;
    Exception?: Error;

    constructor(status: number, error: object | string, response?: object | string, exception?: Error) {
        
        super(typeof error == "object" ? JSON.stringify(error) : error);
        this.status = status;
        this.Error = error;
        this.Response = response;
        this.Exception =  exception;
    }
  }
  

export function GenerateAPIResult(isSuccess: boolean, response?: object | string, error?: object | string) : APIResponse
{
    return {Success : isSuccess, Response : response, Error : error}
}