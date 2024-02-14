import { Document, Schema } from "mongoose";

// Interface representing the User document in MongoDB

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  likedContents: Schema.Types.ObjectId[];
}