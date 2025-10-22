import { Request, Response } from "express";
import { TareaAlumno } from "../models/TareaAlumno";
import { Tarea } from "../models/Tarea";
import { AsignacionAlumno } from "../models/AsignacionAlumno";
import { QueryFailedError } from "typeorm";

export const getAllTareasAlumno = async (req: Request, res: Response): Promise<any> => {
    try {
        const tareasAlumno = await TareaAlumno.find({
            relations: {
                tarea: {
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
                    },
                    bimestre: true
                },
                asignacionAlumno: {
                    alumno: true,
                    estadoAsignacion: true
                }
            }
        });
        return res.send({ message: "Tareas de alumno obtenidas con éxito", tareasAlumno });
    } catch (error) {
        console.error("Error al obtener tareas de alumno:", error);
        return res.status(500).send({ message: "Error interno del servidor" });
    }
};

export const createTareaAlumno = async (req: Request, res: Response): Promise<any> => {
    try {
        const { idTarea, idAsignacionAlumno, fechaEntrega, puntoObtenido } = req.body;

        // Obtener la tarea con su curso, gradoCiclo y grado
        const tarea = await Tarea.findOne({
            where: { id: idTarea },
            relations: [
                'curso',
                'curso.gradoCiclo',
                'curso.gradoCiclo.grado'
            ]
        });
        if (!tarea) {
            return res.status(404).json({ message: 'La tarea no existe' });
        }

        // Obtener la asignación con su alumno y gradoCiclo
        const asignacion = await AsignacionAlumno.findOne({
            where: { id: idAsignacionAlumno },
            relations: [
                'gradoCiclo',
                'gradoCiclo.grado'
            ]
        });
        if (!asignacion) {
            return res.status(404).json({ message: 'La asignación no existe' });
        }

        // Validar que el grado de la tarea y el de la asignación sean iguales
        const gradoTarea = tarea.curso?.gradoCiclo?.grado?.id;
        const gradoAsignacion = asignacion.gradoCiclo?.grado?.id;
        if (!gradoTarea || !gradoAsignacion || gradoTarea !== gradoAsignacion) {
            return res.status(400).json({ message: 'La tarea no pertenece al mismo grado que la asignación del alumno' });
        }

        const nuevaTareaAlumno = new TareaAlumno();
        nuevaTareaAlumno.idTarea = idTarea;
        nuevaTareaAlumno.idAsignacionAlumno = idAsignacionAlumno;
        nuevaTareaAlumno.fechaEntrega = fechaEntrega;
        nuevaTareaAlumno.punteoObtenido = puntoObtenido;

        await nuevaTareaAlumno.save();
        return res.status(200).send({ message: "Tarea de alumno creada con éxito", tareaAlumno: nuevaTareaAlumno });
    } catch (error) {
        if (error instanceof QueryFailedError) {
            const { errno, sqlMessage } = error.driverError || {};
            if (errno === 1452 && sqlMessage?.includes("FK_tareaAlumno_tarea")) {
                return res.status(404).json({ message: "La tarea no existe" });
            }
            if (errno === 1452 && sqlMessage?.includes("FK_tareaAlumno_asignacionAlumno")) {
                return res.status(404).json({ message: "La asignacion no existe" });
            }
            if (errno === 1062 && sqlMessage?.includes("UQ_tareaAlumno_idTarea_idAsignacionAlumno")) {
                // 409 Conflict es el código adecuado para indicar que ya existe un recurso en conflicto
                return res.status(409).json({ message: "Alumno ya tiene calificación de tarea" });
            }
            console.log("Error en BD al modificar usuario: ", error);
            return res.status(500).json({ message: "Error en BD al modificar usuario" });
        }
        console.error("Error al crear tarea de alumno:", error);
        return res.status(500).send({ message: "Error interno del servidor" });
    }
};