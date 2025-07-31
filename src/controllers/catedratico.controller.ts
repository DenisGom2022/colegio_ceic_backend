import { Request, Response } from "express";
import { Catedratico } from "../models/Catedratico";
import { EntityNotFoundError, QueryFailedError } from "typeorm";

export const createCatedratico = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { dpi, idUsuario } = req.body;
        // buscar si ya existe el catedrático
        const existingCatedratico = await Catedratico.findOneBy({ dpi });
        if (existingCatedratico) {
            return resp.status(400).json({ message: "El catedrático ya existe" });
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
            console.log("Error en BD al modificar Catedrático: ", error);
            return resp.status(500).json({ message: "Error en BD al modificar Catedrático" });
        }
        console.error("Error fetching Catedrático:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
}

export const getAllCatedraticos = async (req: Request, resp: Response): Promise<any> => {
    try {
        const catedraticos = await Catedratico.find({relations:{ usuario:true }});
        const catedraticosWhitoutPassword = catedraticos.map(catedratico => {
            console.log(catedratico);
            const usuario = catedratico.usuario;
            const { contrasena, ...usuarioWhitoutPassword } = usuario;
            return {...catedratico, usuario: usuarioWhitoutPassword};
        })
        return resp.status(200).json({ message: "Catedrático encontrados", catedraticos:catedraticosWhitoutPassword });
    } catch (error) {
        console.error("Error fetching Catedrático:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
};

export const getCatedratico = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { dpi } = req.params;

        // Verificar si el usuario ya existe
        const existingCatedratico = await Catedratico.findOneOrFail({ where: { dpi } });
        console.log("dpi", dpi);
        console.log("existingCatedratico", existingCatedratico);
        const usuario = existingCatedratico.usuario;
        const { contrasena, ...usuarioWhitoutPassword } = usuario;
        const catedraticoWhitoutPassword = {...existingCatedratico, usuario:usuarioWhitoutPassword};

        return resp.status(200).json({
            message: "Catedrático encontrado exitosamente",
            catedratico: catedraticoWhitoutPassword
        });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return resp.status(404).json({ message: "Catedratico no encontrado" });
        }
        console.error("Error creating Catedrático:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
};


export const modificarCatedratico = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { dpi, idUsuario } = req.body;

        // Verificar si el usuario ya existe
        const existingCatedratico = await Catedratico.findOneOrFail({ where: { dpi } });

        existingCatedratico.idUsuario = idUsuario;
        if (existingCatedratico.usuario) {
            existingCatedratico.usuario.usuario = idUsuario;
        }
        await existingCatedratico.save();

        return resp.status(200).json({
            message: "Catedrático modificado exitosamente"
        });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return resp.status(404).json({ message: "Catedrático no encontrado" });
        }

        if (error instanceof QueryFailedError) {
            const { errno, sqlMessage } = error.driverError || {};
            if (errno === 1062 && sqlMessage?.includes("IDX_UNIQUE_ID_USUARIO")) {
                return resp.status(400).json({ message: "Usuario ya pertenece a un catedrático" });
            }
            if (errno === 1452 && sqlMessage?.includes("FK_id_usuario")) {
                return resp.status(404).json({ message: "Usuario no existe" });
            }
            console.log("Error en BD al modificar Catedrático: ", error);
            return resp.status(500).json({ message: "Error en BD al modificar usuario" });
        }
        console.error("Error modificando Catedrático:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
}
