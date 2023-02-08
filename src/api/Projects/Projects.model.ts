import { model, Schema, Document } from "mongoose";
import { IUser } from "../Users/User.model";

export interface IProject extends Document {
  name: string;
  startDate: string;
  endDate?: string;
  items?: string;
  users?: IUser["_id"];
}
const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: false },
    items: { type: String, required: false },
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
