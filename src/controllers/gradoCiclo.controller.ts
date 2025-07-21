import { Request, Response } from "express";
import { GradoCiclo } from "../models/GradoCiclo";
import { AppDataSource } from "../config/data-source";
import { EntityNotFoundError, QueryFailedError } from "typeorm";

const gradoCicloRepo = AppDataSource.getRepository(GradoCiclo);

export const getAllGradoCiclos = async (req: Request, res: Response): Promise<any> => {
    try {
        const gradoCiclos = await gradoCicloRepo.find({
            relations: {
                grado: {
                    nivelAcademico: true,
                    jornada: true
                },
                ciclo: true
            }
        });
        return res.status(200).json({ message: "GradoCiclos obtenidos exitosamente", gradoCiclos });
    } catch (error) {
        console.error("Error obteniendo gradoCiclos:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getGradoCiclo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const gradoCiclo = await gradoCicloRepo.findOne({ where: { id: Number(id) }, relations: ["grado", "ciclo"] });
        if (!gradoCiclo) return res.status(404).json({ message: "GradoCiclo no encontrado" });
        return res.status(200).json({ message: "GradoCiclo obtenido exitosamente", gradoCiclo });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "GradoCiclo no encontrado" });
        }
        console.error("Error obteniendo gradoCiclo:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const crearGradoCiclo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { idGrado, idCiclo, precioPago, cantidadPagos, precioInscripcion } = req.body;
        const gradoCicloExistente = await gradoCicloRepo.findOne({ where: { idGrado, idCiclo } });
        if (gradoCicloExistente) {
            return res.status(400).json({ message: "Ya existe un registro para ese grado y ciclo" });
        }
        const gradoCiclo = gradoCicloRepo.create({ idGrado, idCiclo, precioPago, cantidadPagos, precioInscripcion });
        await gradoCicloRepo.save(gradoCiclo);
        return res.status(201).json({ message: "GradoCiclo creado exitosamente", gradoCiclo });
    } catch (error) {
        if (error instanceof QueryFailedError) {
            const { errno, sqlMessage } = error.driverError || {};
            if (errno === 1452 && sqlMessage?.includes("FK_gradoCiclo_grado")) {
                return res.status(404).json({ message: "El grado no existe" });
            }
            if (errno === 1452 && sqlMessage?.includes("FK_gradoCiclo_ciclo")) {
                return res.status(404).json({ message: "El ciclo no existe" });
            }
            console.log("Error en BD al modificar usuario: ", error);
            return res.status(500).json({ message: "Error en BD al modificar usuario" });
        }
        console.error("Error creando gradoCiclo:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const modificarGradoCiclo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id, idGrado, idCiclo, precioPago, cantidadPagos, precioInscripcion } = req.body;
        const gradoCiclo = await gradoCicloRepo.findOneByOrFail({ id: Number(id) });
        gradoCiclo.idGrado = idGrado;
        gradoCiclo.idCiclo = idCiclo;
        gradoCiclo.precioPago = precioPago;
        gradoCiclo.cantidadPagos = cantidadPagos;
        gradoCiclo.precioInscripcion = precioInscripcion;
        await gradoCicloRepo.save(gradoCiclo);
        return res.status(200).json({ message: "GradoCiclo modificado exitosamente", gradoCiclo });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "GradoCiclo no encontrado" });
        }
        if (error instanceof QueryFailedError) {
            const { errno, sqlMessage } = error.driverError || {};
            if (errno === 1452 && sqlMessage?.includes("FK_gradoCiclo_grado")) {
                return res.status(404).json({ message: "El grado no existe" });
            }
            if (errno === 1452 && sqlMessage?.includes("FK_gradoCiclo_ciclo")) {
                return res.status(404).json({ message: "El ciclo no existe" });
            }
            console.log("Error en BD al modificar usuario: ", error);
            return res.status(500).json({ message: "Error en BD al modificar usuario" });
        }
        console.error("Error modificando gradoCiclo:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const eliminarGradoCiclo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const gradoCiclo = await gradoCicloRepo.findOneByOrFail({ id: Number(id) });
        await gradoCicloRepo.softRemove(gradoCiclo);
        return res.status(200).json({ message: "GradoCiclo eliminado exitosamente" });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "GradoCiclo no encontrado" });
        }
        console.error("Error eliminando gradoCiclo:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};