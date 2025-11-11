import { Request, Response } from "express";
import { AsignacionAlumno } from "../models/AsignacionAlumno";
import { Alumno } from "../models/Alumno";
import { EntityNotFoundError, QueryFailedError } from "typeorm";
import { Grado } from "../models/Grado";
import { GradoCiclo } from "../models/GradoCiclo";

// Obtener todas las asignaciones sin paginación
export const getAllAsignacionesAlumno = async (req:Request, res:Response):Promise<any> => {
    try {
        const asignaciones = await AsignacionAlumno.find({
            relations: {
                gradoCiclo: {
                    grado:{
                        jornada: true,
                        nivelAcademico: true
                    },
                    ciclo: true
                },
                alumno: true,
                estadoAsignacion: true
            }
        });
        const total = asignaciones.length;
        return res.status(200).send({
            message: "Asignaciones obtenidas con exito",
            asignaciones,
            total
        });
    } catch(error) {
        console.log("Error al obtener asignaciones", error);
        return res.status(500).send({ message: "Error al obtener asignaciones" })
    }
}

// Obtener asignaciones con paginación
export const getAsignacionesAlumnoPaginado = async (req:Request, res:Response):Promise<any> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const nombre = req.query.nombre as string | undefined;

        // Usar queryBuilder para filtrar por nombre de alumno si se proporciona
        const queryBuilder = AsignacionAlumno.createQueryBuilder("asignacion")
            .leftJoinAndSelect("asignacion.gradoCiclo", "gradoCiclo")
            .leftJoinAndSelect("gradoCiclo.grado", "grado")
            .leftJoinAndSelect("grado.jornada", "jornada")
            .leftJoinAndSelect("grado.nivelAcademico", "nivelAcademico")
            .leftJoinAndSelect("gradoCiclo.ciclo", "ciclo")
            .leftJoinAndSelect("asignacion.alumno", "alumno")
            .leftJoinAndSelect("asignacion.estadoAsignacion", "estadoAsignacion");

        if (nombre) {
            queryBuilder.andWhere(
                `(
                    alumno.primer_nombre LIKE :nombre OR
                    alumno.segundo_nombre LIKE :nombre OR
                    alumno.tercer_nombre LIKE :nombre OR
                    alumno.primer_apellido LIKE :nombre OR
                    alumno.segundo_apellido LIKE :nombre
                )`,
                { nombre: `%${nombre}%` }
            );
        }

        queryBuilder.skip(skip).take(limit);

        const [asignaciones, total] = await queryBuilder.getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        return res.status(200).send({
            message: "Asignaciones obtenidas con exito",
            asignaciones,
            total,
            page,
            limit,
            totalPages
        });
    } catch(error) {
        console.log("Error al obtener asignaciones paginadas", error);
        return res.status(500).send({ message: "Error al obtener asignaciones paginadas" })
    }
}

export const createAsignacionAlumno = async (req:Request, res:Response):Promise<any> => {
    try{
        const { cuiAlumno, idGrado } = req.body;
        const alumno = await Alumno.findOneOrFail({
            where: {
                cui: cuiAlumno
            }
        });

        const grado = await Grado.findOneOrFail({
            where: {
                id: idGrado
            },
            relations: {
                gradosCiclo: {
                    ciclo: true
                }
            }
        });

        // Buscar si hay algún ciclo relacionado con fechaFin == null
        const gradoCicloActivo = grado.gradosCiclo?.find((gc: GradoCiclo) => gc.ciclo && gc.ciclo.fechaFin === null);

        if (!gradoCicloActivo) {
            return res.status(400).send({ message: "El grado no está relacionado a un ciclo activo" });
        }

        // Validar si el alumno ya está asignado a cualquier grado del ciclo activo (fechaFin == null) y la asignación está activa
        // Se asume que el estado activo es idEstadoAsignacion = 1
        const asignacionExistente = await AsignacionAlumno.createQueryBuilder("asignacion")
            .leftJoin("asignacion.gradoCiclo", "gradoCiclo")
            .leftJoin("gradoCiclo.ciclo", "ciclo")
            .where("asignacion.idAlumno = :cuiAlumno", { cuiAlumno })
            .andWhere("asignacion.idEstadoAsignacion = :estadoActivo", { estadoActivo: 1 })
            .andWhere("ciclo.fechaFin IS NULL")
            .getOne();

        if (asignacionExistente) {
            return res.status(400).send({ message: "El alumno ya está asignado a un ciclo activo con una asignación activa" });
        }

        const newAsignacion = new AsignacionAlumno();
        newAsignacion.gradoCiclo = gradoCicloActivo;
        newAsignacion.idAlumno = cuiAlumno;
        newAsignacion.idEstadoAsignacion = 1;

        const asignacion = await newAsignacion.save();

        // Aquí iría la lógica para crear la asignación, si es necesario
        return res.send({ message: "asignación creada con éxito", asignacion });
    }catch(error){
        if(error instanceof EntityNotFoundError){
            if(error.message.includes("Alumno")){
                return res.status(404).send({ message: "Alumno no existe" });
            }else if(error.message.includes("Grado")){
                return res.status(404).send({ message: "Grado no existe" });
            }else{
                return res.status(404).send({ message: "Error EntityNotFoundError no controlado" });
            }
        }
        if(error instanceof QueryFailedError){
            if(error.driverError.errno == 1062 && error.driverError.sqlMessage.includes("UQ_asignacion_alumno_gradoCiclo_alumno")){
                return res.status(400).send({ message: "Alumno ya se encuentra asignado a grado" });
            }
        }
        console.log("Error al crear asignacion", error);
        return res.status(500).send({ message: "Error al crear asignacion", error })
    }
}

// Obtener una asignación por id
export const getAsignacion = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).send({ message: "ID inválido" });
        }
        const asignacion = await AsignacionAlumno.findOne({
            where: { id },
            relations: {
                gradoCiclo: {
                    grado: {
                        jornada: true,
                        nivelAcademico: true
                    },
                    ciclo: true
                },
                alumno: true,
                estadoAsignacion: true,
                pagos: {
                    tipoPago: true
                },
                tareaAlumnos: {
                    tarea: {
                        curso: true
                    }
                }
            }
        });
        if (!asignacion) {
            return res.status(404).send({ message: "Asignación no encontrada" });
        }
        return res.status(200).send({
            message: "Asignación obtenida con exito",
            asignacion
        });
    } catch (error) {
        console.log("Error al obtener asignación", error);
        return res.status(500).send({ message: "Error al obtener asignación" });
    }
}

export const updateAsignacion = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const { idGrado } = req.body;
        const asignacion = await AsignacionAlumno.findOneOrFail({
            where: { id },
            relations: {
                gradoCiclo: {
                    ciclo: true
                }
            }
        });

        // Validar si la asignación se encuentra en un ciclo activo
        if (asignacion.gradoCiclo.ciclo.fechaFin !== null) {
            return res.status(400).send({ message: "La asignación no pertenece a un ciclo activo, no se puede modificar" });
        }

        const grado = await Grado.findOneOrFail({
            where: { id: idGrado },
            relations: {
                gradosCiclo: {
                    ciclo: true
                }
            }
        });
        const gradoCicloActivo = grado.gradosCiclo?.find((gc: GradoCiclo) => gc.ciclo && gc.ciclo.fechaFin === null);

        if (!gradoCicloActivo) {
            return res.status(400).send({ message: "El grado no está relacionado a un ciclo activo" });
        }
        asignacion.gradoCiclo = gradoCicloActivo;
        const updatedAsignacion = await asignacion.save();
        return res.status(200).send({
            message: "Asignación actualizada con éxito",
            asignacion: updatedAsignacion
        });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            if(error.message.includes("AsignacionAlumno")) {
                return res.status(404).send({ message: "Asignación no encontrada" });
            }
            return res.status(404).send({ message: "Alguna entidad no encontrada" });
        }
        if (error instanceof QueryFailedError) {
            if (error.driverError.errno == 1062 && error.driverError.sqlMessage.includes("UQ_asignacion_alumno_gradoCiclo_alumno")) {
                return res.status(400).send({ message: "El alumno ya se encuentra asignado a ese grado" });
            }
        }
        console.log("Error al actualizar asignación", error);
        return res.status(500).send({ message: "Error al actualizar asignación" });
    }
};

export const deleteAsignacion = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const asignacion = await AsignacionAlumno.findOneOrFail({
            where: { id },
            relations: {
                tareaAlumnos: true,
                gradoCiclo: {
                    ciclo: true
                }
            }
        });

        // Validar si la asignación tiene tareas creadas
        if (asignacion.tareaAlumnos && asignacion.tareaAlumnos.length > 0) {
            return res.status(400).send({ message: "No se puede eliminar la asignación porque tiene tareas asignadas" });
        }

        // Validar si el ciclo ya ha finalizado
        if (asignacion.gradoCiclo.ciclo.fechaFin !== null) {
            return res.status(400).send({ message: "No se puede eliminar la asignación porque el ciclo ya ha finalizado" });
        }

        await asignacion.remove();
        return res.status(200).send({ message: "Asignación eliminada con éxito" });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).send({ message: "Asignación no encontrada" });
        } 
        console.log("Error al eliminar asignación", error);
        return res.status(500).send({ message: "Error al eliminar asignación" });
    }
};