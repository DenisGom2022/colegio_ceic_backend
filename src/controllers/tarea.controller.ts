import { Request, Response } from "express";
import { Tarea } from "../models/Tarea";
import { Curso } from "../models/Curso";
import { JwtPayload } from "../interfaces/interfaces";
import { ROLES } from "../utils/roles";
import { FindOptions, FindOptionsWhere } from "typeorm";
import { Bimestre } from "../models/Bimestre";

export const getAllTareas = async (req: Request, res: Response): Promise<any> => {
    try {
        const tareas = await Tarea.find();
        return res.send({ message: "Tareas obtenidas con éxito", tareas });
    } catch (error) {
        console.error("Error al obtener tareas:", error);
        return res.status(500).send({ message: "Error interno del servidor" });
    }
}

export const getAllMisTareas = async (req: Request, res: Response): Promise<any> => {
    try {
        const valorToken: JwtPayload = (req as any).valorToken;
        const { idCurso }: any = req.query;
        const whereOptions: FindOptionsWhere<Tarea> = {
            curso: {
                catedratico: {
                    usuario: {
                        usuario: valorToken?.usuario?.usuario
                    }
                }
            }
        };

        if (idCurso) {
            whereOptions.idCurso = idCurso;
        }

        const tareas = await Tarea.find({
            where: whereOptions,
            relations: {
                curso: {
                    catedratico: {
                        usuario: true
                    },
                    gradoCiclo: {
                        ciclo: true,
                        grado: {
                            nivelAcademico: true,
                            jornada: true
                        }
                    }
                }
            }
        });

        return res.send({ message: "Tareas obtenidas con éxito", tareas });
    } catch (error) {
        console.error("Error al crear tipo de parentesco:", error);
        return res.status(500).send({ message: "Error interno del servidor" });
    }
}

export const createTarea = async (req: Request, res: Response): Promise<any> => {
    try {
        const { titulo, descripcion, punteo, fechaEntrega, idCurso, nroBimestre } = req.body;
        const valorToken: JwtPayload = (req as any).valorToken;

        const curso = await Curso.findOne({
            where: { id: idCurso },
            relations: {
                catedratico: {
                    usuario: true
                },
                gradoCiclo: {
                    ciclo: {
                        bimestres: {
                            estado: true
                        }
                    }
                }
            }
        });
        if (!curso) return res.status(404).send({ message: "Curso no existe" });
        if (curso?.gradoCiclo?.ciclo?.fechaFin != null) return res.status(400).send({ message: "Curso ya finalizado, no se pueden agregar tareas" });
        if (punteo > curso?.notaMaxima) return res.status(400).send({ message: `La nota no puede ser mayor a la nota máxima del curso (${curso?.notaMaxima})` });
        if (valorToken.role == ROLES.DOCENTE && curso?.catedratico?.usuario?.usuario != valorToken?.usuario?.usuario) {
            return res.status(400).send({ message: "Este curso no le pertenece" });
        }

        const bimestre = curso?.gradoCiclo?.ciclo?.bimestres?.find(e => e.numeroBimestre == nroBimestre);
        if(!bimestre){
            return res.status(400).send({ message: "Bimestre no existe" });
        }
        if (bimestre?.idEstado != 1) return res.status(400).send({ message: "Bimestre en estado: " + bimestre?.estado?.descripcion });

        const tarea = new Tarea();
        tarea.titulo = titulo;
        tarea.descripcion = descripcion;
        tarea.punteo = punteo;
        tarea.fechaEntrega = fechaEntrega;
        tarea.bimestre = bimestre;
        tarea.curso = curso;

        await tarea.save();
        return res.status(201).send({ message: "Tarea creada con éxito", tarea });
    } catch (error) {
        console.error("Error al crear tarea:", error);
        return res.status(500).send({ message: "Error interno del servidor" });
    }
}