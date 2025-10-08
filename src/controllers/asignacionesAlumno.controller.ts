import { Request, Response } from "express";
import { AsignacionAlumno } from "../models/AsignacionAlumno";
import { Alumno } from "../models/Alumno";
import { EntityNotFoundError, QueryFailedError } from "typeorm";
import { Grado } from "../models/Grado";
import { GradoCiclo } from "../models/GradoCiclo";

export const getAllAsignacionesAlumno = async (req:Request, res:Response):Promise<any> => {
    try{
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

        return res.status(200).send({ message: "Asignaciones obtenidas con exito", asignaciones });
    }catch(error){
        console.log("Error al obtener asignaciones", error);
        return res.status(500).send({ message: "Error al obtener asignaciones" })
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