import { Usuario } from "../models/Usuario";
import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";

export const getAllUsuarios = async (req: Request, res: Response) => {
    try {
        const usuarios = await findUsers();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Error fetching usuarios:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const findUsers = async () => {
    return await Usuario.find({
        select: {
            usuario: true,
            primerNombre: true,
            segundoNombre: true,
            tercerNombre: true,
            primerApellido: true,
            segundoApellido: true,
            telefono: true,
            createdAt: true,
            updatedAt: true,
            tipoUsuario: {
                id: true,
                descripcion: true,
            },
        },
    });
};
 
export const crearUsuario = async (req: Request, resp: Response) => {
    try {
        const { usuario, contrasena, primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido, telefono, idTipoUsuario } = req.body;

        // Encriptar la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const newUser = Usuario.create({
            usuario,
            contrasena: hashedPassword,
            primerNombre,
            segundoNombre,
            tercerNombre,
            primerApellido,
            segundoApellido,
            telefono,
            idTipoUsuario
        });

        await newUser.save();

        resp.status(200).json({
            message: "Usuario creado exitosamente",
            user: newUser
        });
    } catch (error) {
        console.error("Error creating usuario:", error);
        resp.status(500).json({ message: "Internal server error" });
    }
}
