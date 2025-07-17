import { Request, Response } from "express";
import { NivelAcademico } from "../models/NivelAcademico";
import { AppDataSource } from "../config/data-source";
import { EntityNotFoundError } from "typeorm";

const nivelAcademicoRepo = AppDataSource.getRepository(NivelAcademico);

export const getAllNivelAcademico = async (req: Request, res: Response): Promise<any> => {
    try {
        const niveles = await nivelAcademicoRepo.find();
        return res.status(200).json({ message: "Niveles académicos obtenidos exitosamente", niveles });
    } catch (error) {
        console.error("Error obteniendo niveles académicos:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getNivelAcademico = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const nivel = await nivelAcademicoRepo.findOneByOrFail({ id: Number(id) });
        return res.status(200).json({ message: "Nivel académico obtenido exitosamente", nivel });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Nivel académico no encontrado" });
        }
        console.error("Error obteniendo nivel académico:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const crearNivelAcademico = async (req: Request, res: Response): Promise<any> => {
    try {
        const { descripcion } = req.body;
        const nivelExistente = await nivelAcademicoRepo.findOne({ where: { descripcion } });
        if (nivelExistente) {
            return res.status(400).json({ message: "Ya existe un nivel académico con esa descripción" });
        }
        const nivel = nivelAcademicoRepo.create({ descripcion });
        await nivelAcademicoRepo.save(nivel);
        return res.status(201).json({ message: "Nivel académico creado exitosamente", nivel });
    } catch (error) {
        console.error("Error creando nivel académico:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const modificarNivelAcademico = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id, descripcion } = req.body;
        const nivel = await nivelAcademicoRepo.findOneByOrFail({ id: Number(id) });
        nivel.descripcion = descripcion;
        await nivelAcademicoRepo.save(nivel);
        return res.status(200).json({ message: "Nivel académico modificado exitosamente", nivel });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Nivel académico no encontrado" });
        }
        console.error("Error modificando nivel académico:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const eliminarNivelAcademico = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const nivel = await nivelAcademicoRepo.findOneByOrFail({ id: Number(id) });
        await nivelAcademicoRepo.softRemove(nivel);
        return res.status(200).json({ message: "Nivel académico eliminado exitosamente" });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Nivel académico no encontrado" });
        }
        console.error("Error eliminando nivel académico:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
