import { Request, Response } from "express";
import { AsignacionCatedratico } from "../models/AsignacionCatedratico";
import { AppDataSource } from "../config/data-source";
import { EntityNotFoundError, QueryFailedError } from "typeorm";

const asignacionRepo = AppDataSource.getRepository(AsignacionCatedratico);

export const getAllAsignaciones = async (req: Request, res: Response): Promise<any> => {
    try {
        const asignaciones = await asignacionRepo.find({ relations: ["gradoCiclo", "catedratico", "curso"] });
        return res.status(200).json({ message: "Asignaciones obtenidas exitosamente", asignaciones });
    } catch (error) {
        console.error("Error obteniendo asignaciones:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAsignacion = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const asignacion = await asignacionRepo.findOne({ where: { id: Number(id) }, relations: ["gradoCiclo", "catedratico", "curso"] });
        if (!asignacion) return res.status(404).json({ message: "Asignación no encontrada" });
        return res.status(200).json({ message: "Asignación obtenida exitosamente", asignacion });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Asignación no encontrada" });
        }
        console.error("Error obteniendo asignación:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const crearAsignacion = async (req: Request, res: Response): Promise<any> => {
    try {
        const { idGradoCiclo, idCatedratico, idCurso, notaMaxima, notaAprobada } = req.body;
        const asignacionExistente = await asignacionRepo.findOne({ where: { idGradoCiclo, idCatedratico, idCurso } });
        if (asignacionExistente) {
            return res.status(400).json({ message: "Ya existe una asignación con esos datos" });
        }
        const asignacion = asignacionRepo.create({ idGradoCiclo, idCatedratico, idCurso, notaMaxima, notaAprobada });
        await asignacionRepo.save(asignacion);
        return res.status(201).json({ message: "Asignación creada exitosamente", asignacion });
    } catch (error) {
        if (error instanceof QueryFailedError) {
            const { errno, sqlMessage } = error.driverError || {};
            if (errno === 1452 && sqlMessage?.includes("FK_asignacionCatedratico_curso")) {
                return res.status(404).json({ message: "Curso no existe" });
            }
            if (errno === 1452 && sqlMessage?.includes("FK_asignacionCatedratico_catedratico`")) {
                return res.status(404).json({ message: "Catedrático no existe" });
            }
            console.log("Error en BD al modificar Catedrático: ", error);
            return res.status(500).json({ message: "Error en BD al modificar usuario" });
        }
        console.error("Error creando asignación:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const modificarAsignacion = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id, idGradoCiclo, idCatedratico, idCurso, notaMaxima, notaAprobada } = req.body;
        const asignacion = await asignacionRepo.findOneByOrFail({ id: Number(id) });
        asignacion.idGradoCiclo = idGradoCiclo;
        asignacion.idCatedratico = idCatedratico;
        asignacion.idCurso = idCurso;
        asignacion.notaMaxima = notaMaxima;
        asignacion.notaAprobada = notaAprobada;
        await asignacionRepo.save(asignacion);
        return res.status(200).json({ message: "Asignación modificada exitosamente", asignacion });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Asignación no encontrada" });
        }
        if (error instanceof QueryFailedError) {
            const { errno, sqlMessage } = error.driverError || {};
            if (errno === 1452 && sqlMessage?.includes("FK_asignacionCatedratico_curso")) {
                return res.status(404).json({ message: "Curso no existe" });
            }
            if (errno === 1452 && sqlMessage?.includes("FK_asignacionCatedratico_catedratico`")) {
                return res.status(404).json({ message: "Catedrático no existe" });
            }
            console.log("Error en BD al modificar Catedrático: ", error);
            return res.status(500).json({ message: "Error en BD al modificar usuario" });
        }
        console.error("Error modificando asignación:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const eliminarAsignacion = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const asignacion = await asignacionRepo.findOneByOrFail({ id: Number(id) });
        await asignacionRepo.softRemove(asignacion);
        return res.status(200).json({ message: "Asignación eliminada exitosamente" });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Asignación no encontrada" });
        }
        console.error("Error eliminando asignación:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
