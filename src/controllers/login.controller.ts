import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import { EntityNotFoundError } from "typeorm";
import * as bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { JwtPayload } from "../interfaces/interfaces";

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
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
            usuario: user.usuario,
            role: user.idTipoUsuario
        };

        const token = generateToken(jwtPayload)

        res.status(200).json({
            message: "Login successful",
            token,
            user: userWithoutPassword
        }); 

    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
