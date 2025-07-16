import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Alumno } from "../models/Alumno";
import { Responsable } from "../models/Responsable";
import { EntityNotFoundError, QueryFailedError } from "typeorm";
import { TipoParentesco } from "../models/TipoParentesco";
import { TipoParentescoNotFoundError } from "../errors/alumno.errors";

export const crearAlumno = async (req: Request, resp: Response): Promise<any> => {
    const queryRunner = AppDataSource.createQueryRunner();
    try {
        const { cui, primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido, telefono, genero, responsables } = req.body;
        // Validar si el alumno ya existe por cui
        const alumnoExistente = await Alumno.findOne({ where: { cui } });
        if (alumnoExistente) {
            return resp.status(409).json({ message: "El alumno ya existe" });
        }
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const alumno = new Alumno();
        alumno.cui = cui;
        alumno.primerNombre = primerNombre;
        alumno.segundoNombre = segundoNombre;
        alumno.tercerNombre = tercerNombre;
        alumno.primerApellido = primerApellido;
        alumno.segundoApellido = segundoApellido;
        alumno.telefono = telefono;
        alumno.genero = genero;
        await queryRunner.manager.save(alumno);

        const newResponsables = await generarResponsables(responsables, alumno);

        await Promise.all(
            newResponsables.map((r: Responsable) => queryRunner.manager.save(r))
        );
        await queryRunner.commitTransaction();
        return resp.status(200).send({ message: "Alumno almacenado con exito" })
    } catch (error) {
        await queryRunner.rollbackTransaction();
        if (error instanceof QueryFailedError) {
            console.log("Error en BD al modificar usuario: ", error);
            return resp.status(500).json({ message: "Error en BD al crear alumno" });
        }
        if(error instanceof TipoParentescoNotFoundError){
            return resp.status(404).json({ message: error.message });
        }
        console.error("Error during login:", error);
        return resp.status(500).json({ message: "Internal server error" });
    } finally {
        await queryRunner.release();
    }
}

const generarResponsables = async (responsables: Responsable[], alumno: Alumno) => {
    return Promise.all(
        responsables.map(async (responsable) => {
            const { idResponsable, primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido, telefono, idParentesco } = responsable;
            try {
                const tipoParentesco = await TipoParentesco.findOneByOrFail({ id: idParentesco });
                const newResponsable = new Responsable();
                newResponsable.idResponsable = idResponsable;
                newResponsable.primerNombre = primerNombre;
                newResponsable.segundoNombre = segundoNombre;
                newResponsable.tercerNombre = tercerNombre;
                newResponsable.primerApellido = primerApellido;
                newResponsable.segundoApellido = segundoApellido;
                newResponsable.telefono = telefono;
                newResponsable.idParentesco = idParentesco;
                newResponsable.alumno = alumno;
                return newResponsable;
            } catch (error) {
                if (error instanceof EntityNotFoundError) {
                    throw new TipoParentescoNotFoundError(
                        `No se encontró el tipo de parentesco (${idParentesco}) para el responsable: ${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`
                    );
                }
                throw error;
            }
        })
    );
}

export const getAllAlumnos = async (req: Request, resp: Response): Promise<any> => {
    try {
        const alumnos = await Alumno.find();
        return resp.status(200).json({ message: "usuarios encontrados", alumnos });
    } catch (error) {
        console.error("Error fetching usuarios:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
};