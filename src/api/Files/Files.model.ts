import { model, Schema, Document } from "mongoose";
import { IUser } from "../Users/User.model";
import { IProject } from "../Projects/Projects.model";

export interface IFile extends Document {
  user: IUser["_id"];
  project: IProject["_id"];
  name: string;
  file: string;
}
const fileSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    name: { type: String, required: true },
    file: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IFile>("File", fileSchema);
