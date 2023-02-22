import { model, Schema, Document } from "mongoose";
import { IProject } from "../Projects/Projects.model";

const emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  org: string;
  role: string;
  createdBy?: IUser["_id"];
  project?: IProject["_id"];
}

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      match: [emailRegex, "You must enter a valid email example@example.com"],
      required: [true, "Please Enter an Email"],
    },
    password: {
      type: String,
      required: [true, "You should enter a password"],
    },
    org: {
      type: String,
      required:[true, "Please enter an Org"],
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: ["admin", "support", "client", "projectWorker"],
        message: "Invalid role",
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    project: {
      type:Schema.Types.ObjectId,
      ref:"Project"
    },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
