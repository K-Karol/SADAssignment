import { Schema, model, connect, AggregatePaginateModel, Document} from 'mongoose';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IModule } from '../interfaces/module';

const ModuleSchema = new Schema<IModule>({
    name : {type: String, required: true},
    year: {type: String, required: true},
    semester: {type: String, required: true}, //create a custom schema type?  examples: SEM1 or change to an integer?,
    students: [{type: Schema.Types.ObjectId, ref: "User", required: true}],
    cohorts: [{
      identifier: {type: String, required: true},
      students: [{type: Schema.Types.ObjectId, ref: "User", required: true}]
    }],
    moduleLeader: {type: Schema.Types.ObjectId, ref: "User", required: true},
    instructors: [{type: Schema.Types.ObjectId, ref: "User", required: true}]
});

ModuleSchema.plugin(aggregatePaginate);

interface ModuleModel<T extends Document> extends AggregatePaginateModel<T> {}
interface IModulePaginate extends IModule, Document{}


export const Module = model(
    "Module",
    ModuleSchema
  );

export const ModulePaginate: ModuleModel<IModulePaginate> = model<IModulePaginate>("Module",ModuleSchema) as ModuleModel<IModulePaginate>;

