import { Usuario } from "../models/Usuario";

export interface JwtPayload {
    usuario: Usuario;
    role: number;
}