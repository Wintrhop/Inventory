import { model, Schema, Document } from "mongoose";
import { IUser } from "../Users/User.model";
import { IFile } from "../Files/Files.model";

export interface IProject extends Document {
  name: string;
  startDate: string;
  endDate?: string;
  files?: IFile["_id"];
  users?: IUser["_id"];
}
const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: false },
    files: {
      type: [{ type: Schema.Types.ObjectId, ref: "File" }],
      required: false,
    },
    users: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IProject>("Project", projectSchema);
