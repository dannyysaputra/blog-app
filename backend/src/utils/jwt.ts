import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export const generateToken = (id: string) => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as any,
  };
  return jwt.sign({ id }, env.JWT_SECRET, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};
