import { Request, Response } from "express";
import { Jornada } from "../models/Jornada";
import { AppDataSource } from "../config/data-source";
import { EntityNotFoundError } from "typeorm";

const jornadaRepo = AppDataSource.getRepository(Jornada);

export const getAllJornadas = async (req: Request, res: Response): Promise<any> => {
    try {
        const jornadas = await jornadaRepo.find();
        return res.status(200).json({ message: "Jornadas obtenidas exitosamente", jornadas });
    } catch (error) {
        console.error("Error obteniendo jornadas:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getJornada = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const jornada = await jornadaRepo.findOneByOrFail({ id: Number(id) });
        return res.status(200).json({ message: "Jornada obtenida exitosamente", jornada });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Jornada no encontrada" });
        }
        console.error("Error obteniendo jornada:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const crearJornada = async (req: Request, res: Response): Promise<any> => {
    try {
        const { descripcion } = req.body;
        const jornadaExistente = await jornadaRepo.findOne({ where: { descripcion } });
        if (jornadaExistente) {
            return res.status(400).json({ message: "Ya existe una jornada con esa descripción" });
        }
        const jornada = jornadaRepo.create({ descripcion });
        await jornadaRepo.save(jornada);
        return res.status(201).json({ message: "Jornada creada exitosamente", jornada });
    } catch (error) {
        console.error("Error creando jornada:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const modificarJornada = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id, descripcion } = req.body;
        const jornada = await jornadaRepo.findOneByOrFail({ id: Number(id) });
        jornada.descripcion = descripcion;
        await jornadaRepo.save(jornada);
        return res.status(200).json({ message: "Jornada modificada exitosamente", jornada });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Jornada no encontrada" });
        }
        console.error("Error modificando jornada:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const eliminarJornada = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const jornada = await jornadaRepo.findOneByOrFail({ id: Number(id) });
        await jornadaRepo.softRemove(jornada);
        return res.status(200).json({ message: "Jornada eliminada exitosamente" });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Jornada no encontrada" });
        }
        console.error("Error eliminando jornada:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
