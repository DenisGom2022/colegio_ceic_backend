import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import { EntityNotFoundError } from "typeorm";
import * as bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { JwtPayload } from "../interfaces/interfaces";

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        let message = "Login successful";
        const { username, password } = req.body;
        const user = await Usuario.findOneOrFail({
            where: {
                usuario: username,
            }
        });

        const isPasswordValid = await bcrypt.compare(password, user.contrasena);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Exclude password from user object
        const { contrasena, ...userWithoutPassword } = user;

        const jwtPayload:JwtPayload = {
            usuario: user,
            role: user.idTipoUsuario
        };

        let cambiarContrasena = false;

        if( user.cambiarContrasena == 1) {
            message = "Debe cambiar su contraseña";
            cambiarContrasena = true;
        }

        let token = "";
        if(!cambiarContrasena){
            token = generateToken(jwtPayload)
        }

        res.status(200).json({
            message,
            token,
            user: userWithoutPassword,
            cambiarContrasena
        }); 

    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const obtenerDatosToken = async (req: Request, res: Response): Promise<any> => {
    try {
        const token:JwtPayload = (req as any ).valorToken;

        const user = await Usuario.findOneByOrFail({ usuario: token.usuario.usuario });
        const { contrasena, ...userWithoutPassword } = user;

        return res.status(200).json({
            message: "Datos del token obtenidos exitosamente",
            user: userWithoutPassword
        });
    } catch (error) {
        console.error("Error obteniendo datos del token:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}