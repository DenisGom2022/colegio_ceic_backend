import { Request, Response } from "express";
import { Curso } from "../models/Curso";
import { AppDataSource } from "../config/data-source";
import { EntityNotFoundError } from "typeorm";

const cursoRepo = AppDataSource.getRepository(Curso);

export const getAllCursos = async (req: Request, res: Response): Promise<any> => {
    try {
        const cursos = await cursoRepo.find();
        return res.status(200).json({ message: "Cursos obtenidos exitosamente", cursos });
    } catch (error) {
        console.error("Error obteniendo cursos:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getCurso = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const curso = await cursoRepo.findOneByOrFail({ id: Number(id) });
        return res.status(200).json({ message: "Curso obtenido exitosamente", curso });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }
        console.error("Error obteniendo curso:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const crearCurso = async (req: Request, res: Response): Promise<any> => {
    try {
        const { nombre } = req.body;
        const cursoExistente = await cursoRepo.findOne({ where: { nombre } });
        if (cursoExistente) {
            return res.status(400).json({ message: "Ya existe un curso con ese nombre" });
        }
        const curso = cursoRepo.create({ nombre });
        await cursoRepo.save(curso);
        return res.status(201).json({ message: "Curso creado exitosamente", curso });
    } catch (error) {
        console.error("Error creando curso:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const modificarCurso = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id, nombre } = req.body;
        const curso = await cursoRepo.findOneByOrFail({ id: Number(id) });
        curso.nombre = nombre;
        await cursoRepo.save(curso);
        return res.status(200).json({ message: "Curso modificado exitosamente", curso });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }
        console.error("Error modificando curso:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const eliminarCurso = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const curso = await cursoRepo.findOneByOrFail({ id: Number(id) });
        await cursoRepo.softRemove(curso);
        return res.status(200).json({ message: "Curso eliminado exitosamente" });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }
        console.error("Error eliminando curso:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
