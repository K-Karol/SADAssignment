import mongoose from "mongoose";

export interface IAPIResponse {
    Success: boolean;
    Response?: object | string;
    Error?: object | string;
}

export class APIResponse implements IAPIResponse {
    Success: boolean = false;
    Response?: object | string;
    Error?: object | string;
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
        this.Exception = exception;
    }
}


export function GenerateAPIResult(isSuccess: boolean, response?: object | string, error?: object | string): APIResponse {
    return { Success: isSuccess, Response: response, Error: error }
}

export const RemoveUndefinedFieldsRoot = (obj: any) => {
    let newObj = {};
    Object.keys(obj).forEach((key) => { if (obj[key] !== undefined) (newObj as any)[key] = obj[key] });
    return newObj;
}

export const RecursiveRemoveUndefinedFields = (obj: any) => {
    let newObj = {};
    Object.keys(obj).forEach((key) => {
        if (obj[key] === Object(obj[key])) (newObj as any)[key] = RecursiveRemoveUndefinedFields(obj[key]);
        else if (obj[key] !== undefined) (newObj as any)[key] = obj[key];
    });
    return newObj;
};

export const GoThroughJSONAndReplaceObjectIDs = (obj: any) => {

    const regexp =  "ObjectID\\((.+)\\)";

    if(obj instanceof Object){
        Object.entries(obj).forEach(([k, v]) => {
            if((typeof v === 'string' || v instanceof String) && v.match(regexp)){
                obj[k] = new mongoose.Types.ObjectId(v.match(regexp)![1]);
                return;
            }
            if(v instanceof Object || typeof v === "object" || v instanceof Array){
                GoThroughJSONAndReplaceObjectIDs(v);
                return;
            }
        });
    } else if (obj instanceof Array){
        obj.forEach((arrV, indx) => {
            if((typeof arrV === 'string' || arrV instanceof String) && arrV.match(regexp)){
                obj[indx] = new mongoose.Types.ObjectId(arrV.match(regexp)![1]);
                return;
            }
            if(arrV instanceof Object ||  typeof arrV === "object" || arrV instanceof Array){
                GoThroughJSONAndReplaceObjectIDs(arrV);
                return;
            }
        })
    }

    
}