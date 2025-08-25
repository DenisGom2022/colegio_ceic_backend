import { Request, Response } from "express";
import { Curso } from "../models/Curso";
import { AppDataSource } from "../config/data-source";
import { EntityNotFoundError, QueryFailedError } from "typeorm";
import { Ciclo } from "../models/Ciclo";
import { GradoCiclo } from "../models/GradoCiclo";
import { IsNull } from "typeorm";

const cursoRepo = AppDataSource.getRepository(Curso);

export const getAllCursos = async (req: Request, res: Response): Promise<any> => {
    try {
        // Usar el repositorio para crear el query builder y ordenar por fechaFin de ciclo
        const cursos = await cursoRepo.createQueryBuilder("curso")
            .leftJoinAndSelect("curso.gradoCiclo", "gradoCiclo")
            .leftJoinAndSelect("gradoCiclo.ciclo", "ciclo")
            .leftJoinAndSelect("curso.catedratico", "catedratico")
            .leftJoinAndSelect("catedratico.usuario", "usuario")
            .orderBy("ciclo.fechaFin", "ASC")
            .getMany();
        return res.status(200).json({ message: "Cursos obtenidos exitosamente", cursos });
    } catch (error) {
        console.error("Error obteniendo cursos:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getCurso = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const curso = await cursoRepo.findOne({ 
            where: { id: Number(id) }, 
            relations: [
                "gradoCiclo",
                "gradoCiclo.ciclo",
                "catedratico",
                "catedratico.usuario"
            ]
        });
        if (!curso) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }
        return res.status(200).json({ message: "Curso obtenido exitosamente", curso });
    } catch (error) {
        console.error("Error obteniendo curso:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const crearCurso = async (req: Request, res: Response): Promise<any> => {
    try {
        const { nombre, notaMaxima, notaAprobada, idGrado, dpiCatedratico } = req.body;
        // Usar entidades directamente para los repositorios
        const cicloRepo = AppDataSource.getRepository(Ciclo);
        const gradoCicloRepo = AppDataSource.getRepository(GradoCiclo);
        // Buscar ciclo activo (fechaFin == null)
        const cicloActivo = await cicloRepo.findOne({ where: { fechaFin: IsNull() } });
        if (!cicloActivo) {
            return res.status(404).json({ message: "No hay ciclo activo" });
        }
        // Buscar relación grado-ciclo activo
        const gradoCiclo = await gradoCicloRepo.findOne({ where: { grado: { id: idGrado }, ciclo: { id: cicloActivo.id } } });
        if (!gradoCiclo) {
            return res.status(404).json({ message: "El grado no está relacionado al ciclo activo" });
        }
        // Verificar si ya existe el curso en ese gradoCiclo
        const cursoExistente = await cursoRepo.findOne({
            where: {
                nombre,
                gradoCiclo: { id: gradoCiclo.id }
            }
        });
        if (cursoExistente) {
            return res.status(400).json({ message: "Ya existe un curso con ese nombre en el grado para el ciclo activo" });
        }
        // Crear el curso usando el gradoCiclo encontrado
        const curso = cursoRepo.create({ nombre, notaMaxima, notaAprobada, idGradoCiclo: gradoCiclo.id, dpiCatedratico });
        await cursoRepo.save(curso);
        return res.status(201).json({ message: "Curso creado exitosamente", curso });
    } catch (error:any) {
        if (error instanceof QueryFailedError) {
            const { errno, sqlMessage } = error.driverError || {};
            if (errno === 1452 && sqlMessage?.includes("FK_curso_gradoCiclo")) {
                return res.status(404).json({ message: "El gradoCiclo no existe" });
            }
            if (errno === 1452 && sqlMessage?.includes("FK_curso_catedratico")) {
                return res.status(404).json({ message: "El catedratico no existe" });
            }
            console.log("Error en BD al modificar usuario: ", error);
            return res.status(500).json({ message: "Error en BD al modificar usuario" });
        }
        console.error("Error creando curso:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const modificarCurso = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id, nombre, notaMaxima, notaAprobada, idGradoCiclo, dpiCatedratico } = req.body;
        const curso = await cursoRepo.findOneByOrFail({ id });
        curso.nombre = nombre ?? curso.nombre;
        curso.notaMaxima = notaMaxima ?? curso.notaMaxima;
        curso.notaAprobada = notaAprobada ?? curso.notaAprobada;
        curso.idGradoCiclo = idGradoCiclo ?? curso.idGradoCiclo;
        curso.dpiCatedratico = dpiCatedratico ?? curso.dpiCatedratico;
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
