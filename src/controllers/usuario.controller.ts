import { Usuario } from "../models/Usuario";
import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";

export const getAllUsuarios = async (req: Request, res: Response) => {
    try {
        const usuarios = await findUsers();
        res.status(200).json({message: "usuarios encontrados", usuarios});
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
            cambiarContrasena: true,
        },
    });
};
 
export const crearUsuario = async (req: Request, resp: Response) => {
    try {
        const { usuario, contrasena, primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido, telefono, idTipoUsuario } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findOne({ where: { usuario } });
        if (existingUser) {
            return resp.status(400).json({ message: "El usuario ya existe" });
        }

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
            idTipoUsuario,
            cambiarContrasena: 1, // Asignar valor por defecto para cambiarContrasena
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
