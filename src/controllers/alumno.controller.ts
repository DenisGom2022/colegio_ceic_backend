import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Alumno } from "../models/Alumno";
import { Responsable } from "../models/Responsable";
import { Any, EntityNotFoundError, QueryFailedError } from "typeorm";
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
        if (error instanceof TipoParentescoNotFoundError) {
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

export const getAlumno = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { cui } = req.params;

        // Verificar si el alumno ya existe
        const existingAlumno = await Alumno.findOneOrFail({ where: { cui } });

        return resp.status(200).json({
            message: "Alumno encontrado exitosamente",
            Alumno: existingAlumno
        });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return resp.status(404).json({ message: "Alumno no encontrado" });
        }
        console.error("Error creating alumno:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
};

export const modificarAlumno = async (req: Request, resp: Response): Promise<any> => {
    const queryRunner = AppDataSource.createQueryRunner();
    try {
        const { cui, primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido, telefono, genero, responsables } = req.body;
        // Validar si el alumno ya existe por cui        
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const alumnoExistente = await queryRunner.manager.findOneOrFail(Alumno, { where: { cui } });
        alumnoExistente.primerNombre = primerNombre;
        alumnoExistente.segundoNombre = segundoNombre;
        alumnoExistente.tercerNombre = tercerNombre;
        alumnoExistente.primerApellido = primerApellido;
        alumnoExistente.segundoApellido = segundoApellido;
        alumnoExistente.telefono = telefono;
        alumnoExistente.genero = genero;


        // quitar los responsable que ya existen
        const responsablesNuevos = responsables.filter((r: any) => {
            return !alumnoExistente.responsables.some(r2 => r2.idResponsable == r.idResponsable);
        });

        let responsablesEliminar: Responsable[] = [];
        let responsblesModificar: Responsable[] = [];

        // buscar los responsables que se deben eliminar
        for (const r of alumnoExistente.responsables) {
            let encontrado = false;
            for (const r2 of responsables) {
                if (r.idResponsable == r2.idResponsable) {
                    if (!r.isEqual(r2)) {
                        await buscarParentesco(r2);
                        responsblesModificar.push(r.modificaCampos(r2));
                    }
                    encontrado = true;
                    break;
                }
            }
            if (!encontrado) {
                responsablesEliminar.push(r);
            }
        }

        const newResponsables = await generarResponsables(responsablesNuevos, alumnoExistente);

        await Promise.all(
            newResponsables.map((r: Responsable) => queryRunner.manager.save(r))
        );

        await Promise.all(
            responsblesModificar.map(r => queryRunner.manager.save(r))
        );

        await Promise.all(
            responsablesEliminar.map(r => queryRunner.manager.remove(r))
        );

        await queryRunner.commitTransaction();
        return resp.status(200).send({ message: "Alumno modificado con exito" })
    } catch (error) {
        await queryRunner.rollbackTransaction();
        if (error instanceof EntityNotFoundError) {
            return resp.status(404).json({ message: "Alumno no encontrado" });
        }
        if (error instanceof QueryFailedError) {
            console.log("Error en BD al modificar usuario: ", error);
            return resp.status(500).json({ message: "Error en BD al crear alumno" });
        }
        if (error instanceof TipoParentescoNotFoundError) {
            return resp.status(404).json({ message: error.message });
        }
        console.error("Error during login:", error);
        return resp.status(500).json({ message: "Internal server error" });
    } finally {
        await queryRunner.release();
    }
}

const buscarParentesco = async (responsable: Responsable): Promise<TipoParentesco> => {
    const { idParentesco, primerNombre, segundoNombre, primerApellido, segundoApellido } = responsable;
    try {
        const tipoParentesco = await TipoParentesco.findOneByOrFail({ id: idParentesco });
        return tipoParentesco;
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            throw new TipoParentescoNotFoundError(
                `No se encontró el tipo de parentesco (${idParentesco}) para el responsable: ${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`
            );
        } else {
            throw error;
        }
    }
}

export const eliminarAlumno = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { cui } = req.params;

        // Verificar si el alumno ya existe
        const existingAlumno = await Alumno.findOneOrFail({ where: { cui } });
        await existingAlumno.softRemove();

        return resp.status(200).json({
            message: "Alumno eliminado exitosamente",
            Alumno: existingAlumno
        });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return resp.status(404).json({ message: "Alumno no encontrado" });
        }
        console.error("Error creating alumno:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
};