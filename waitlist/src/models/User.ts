// models/User.ts
import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  email: string;
  password?: string;  // Optional if using social login
  name?: string;
  image?: string;  // URL for the user's avatar
  createdAt?: Date;
  updatedAt?: Date;
}
