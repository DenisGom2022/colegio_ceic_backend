import { Request, Response } from "express";
import { Grado } from "../models/Grado";
import { EntityNotFoundError, QueryFailedError } from "typeorm";

export const getAllGrados = async (req: Request, res: Response): Promise<any> => {
    try {
        const grados = await Grado.find({ relations: ["nivelAcademico", "jornada"] });
        return res.status(200).json({ message: "Grados obtenidos exitosamente", grados });
    } catch (error) {
        console.error("Error obteniendo grados:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getGrado = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const grado = await Grado.findOneOrFail({ where: { id: Number(id) }, relations: ["nivelAcademico", "jornada"] });
        return res.status(200).json({ message: "Grado obtenido exitosamente", grado });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Grado no encontrado" });
        }
        console.error("Error obteniendo grado:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const crearGrado = async (req: Request, res: Response): Promise<any> => {
    try {
        const { nombre, idNivel, idJornada } = req.body;
        const gradoExistente = await Grado.findOne({ where: { nombre, idNivel, idJornada } });
        if (gradoExistente) {
            return res.status(400).json({ message: "Ya existe un grado con esos datos" });
        }
        const grado = new Grado();
        grado.nombre = nombre;
        grado.idNivel = idNivel;
        grado.idJornada = idJornada;
        await grado.save();
        return res.status(201).json({ message: "Grado creado exitosamente", grado });
    } catch (error) {
        if (error instanceof QueryFailedError) {
            const { errno, sqlMessage } = error.driverError || {};
            if (errno === 1452 && sqlMessage?.includes("FK_alumno_jornada")) {
                return res.status(404).json({ message: "Jornada no existe" });
            }
            if (errno === 1452 && sqlMessage?.includes("FK_alumno_nivel")) {
                return res.status(404).json({ message: "Nivel no existe" });
            }
            console.log("Error en BD al modificar usuario: ", error);
            return res.status(500).json({ message: "Error en BD al modificar usuario" });
        }
        console.error("Error creando grado:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const modificarGrado = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id, nombre, idNivel, idJornada } = req.body;
        const grado = await Grado.findOneByOrFail({ id: Number(id) });
        grado.nombre = nombre;
        grado.idNivel = idNivel;
        grado.idJornada = idJornada;
        await grado.save();
        return res.status(200).json({ message: "Grado modificado exitosamente", grado });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Grado no encontrado" });
        }
        if (error instanceof QueryFailedError) {
            const { errno, sqlMessage } = error.driverError || {};
            if (errno === 1452 && sqlMessage?.includes("FK_alumno_jornada")) {
                return res.status(404).json({ message: "Jornada no existe" });
            }
            if (errno === 1452 && sqlMessage?.includes("FK_alumno_nivel")) {
                return res.status(404).json({ message: "Nivel no existe" });
            }
            console.log("Error en BD al modificar usuario: ", error);
            return res.status(500).json({ message: "Error en BD al modificar usuario" });
        }
        console.error("Error modificando grado:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const eliminarGrado = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const grado = await Grado.findOneByOrFail({ id: Number(id) });
        await grado.softRemove();
        return res.status(200).json({ message: "Grado eliminado exitosamente" });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Grado no encontrado" });
        }
        console.error("Error eliminando grado:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
