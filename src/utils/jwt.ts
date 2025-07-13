import jwt from 'jsonwebtoken';
import { environments } from "./environments";

const JWT_SECRET = environments.JWT_SECRET;

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET);
}