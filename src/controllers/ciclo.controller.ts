import { Request, Response } from "express";
import { Ciclo } from "../models/Ciclo";
import { AppDataSource } from "../config/data-source";
import { EntityNotFoundError } from "typeorm";

const cicloRepo = AppDataSource.getRepository(Ciclo);

export const getAllCiclos = async (req: Request, res: Response): Promise<any> => {
    try {
        const ciclos = await cicloRepo.find();
        return res.status(200).json({ message: "Ciclos obtenidos exitosamente", ciclos });
    } catch (error) {
        console.error("Error obteniendo ciclos:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getCiclo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }:any = req.params;
        const ciclo = await cicloRepo.findOneByOrFail({ id });
        return res.status(200).json({ message: "Ciclo obtenido exitosamente", ciclo });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Ciclo no encontrado" });
        }
        console.error("Error obteniendo ciclo:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const crearCiclo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id, descripcion } = req.body;
        
        const existingCiclo = await cicloRepo.findOneBy({ id });
        if(existingCiclo){
            return res.status(400).json({ message: "El ciclo ya existe" });
        }
        const ciclo = cicloRepo.create({ id, descripcion });
        await cicloRepo.save(ciclo);
        return res.status(200).json({ message: "Ciclo creado exitosamente", ciclo });
    } catch (error) {
        console.error("Error creando ciclo:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const modificarCiclo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id, descripcion } = req.body;
        const ciclo = await cicloRepo.findOneByOrFail({ id });
        ciclo.descripcion = descripcion;
        await cicloRepo.save(ciclo);
        return res.status(200).json({ message: "Ciclo modificado exitosamente", ciclo });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Ciclo no encontrado" });
        }
        console.error("Error modificando ciclo:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const eliminarCiclo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }:any = req.params;
        const ciclo = await cicloRepo.findOneByOrFail({ id });
        await cicloRepo.softRemove(ciclo);
        return res.status(200).json({ message: "Ciclo eliminado exitosamente" });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Ciclo no encontrado" });
        }
        console.error("Error eliminando ciclo:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
