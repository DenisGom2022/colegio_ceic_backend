import { Usuario } from "../models/Usuario";
import { Request, Response } from "express";

export const getAllUsuarios = async (req:Request, res:Response) => {
    try {
        const usuarios = await Usuario.find({
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
                    descripcion: true
                }
            }
        });
        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Error fetching usuarios:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}