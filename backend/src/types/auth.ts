import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

export interface AuthRequest extends Request {
  user?: IUser;
}