import { Request, Response } from "express";
import { Catedratico } from "../models/Catedratico";
import { QueryFailedError } from "typeorm";

export const createCatedratico = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { dpi, idUsuario } = req.body;
        // buscar si ya existe el catedrático
        const existingCatedratico = await Catedratico.findOneBy({ dpi });
        if (existingCatedratico) {
            return resp.status(400).json({ message: "El usuario ya existe" });
        }
        const newCatedratico = new Catedratico();
        newCatedratico.dpi = dpi;
        newCatedratico.idUsuario = idUsuario;
        await newCatedratico.save();
        return resp.send({ message: "Catedratico guardado con éxito" });
    } catch (error) {
        if (error instanceof QueryFailedError) {
            const { errno, sqlMessage } = error.driverError || {};
            if (errno === 1062 && sqlMessage?.includes("IDX_UNIQUE_ID_USUARIO")) {
                return resp.status(400).json({ message: "Usuario ya pertenece a un catedrático" });
            }
            if (errno === 1452 && sqlMessage?.includes("FK_id_usuario")) {
                return resp.status(404).json({ message: "Usuario no existe" });
            }
            console.log("Error en BD al modificar usuario: ", error);
            return resp.status(500).json({ message: "Error en BD al modificar usuario" });
        }
        console.error("Error fetching usuarios:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
}

export const getAllCatedraticos = async (req: Request, res: Response) => {
    try {
        const usuarios = await Catedratico.find();
        res.status(200).json({ message: "usuarios encontrados", usuarios });
    } catch (error) {
        console.error("Error fetching usuarios:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};