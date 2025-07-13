import jwt from 'jsonwebtoken';
import { environments } from "./environments";
import { JwtPayload } from '../interfaces/interfaces';

const JWT_SECRET = environments.JWT_SECRET;

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '5h', // Token expires in 5 hour
    });
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};