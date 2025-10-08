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
        const search = req.query.search as string || '';
        const pageParam = req.query.page as string;
        const limitParam = req.query.limit as string;
        
        // Verificar si se solicitó paginación
        const isPaginated = pageParam !== undefined && limitParam !== undefined;
        const page = isPaginated ? parseInt(pageParam) || 1 : null;
        const limit = isPaginated ? parseInt(limitParam) || 10 : null;
        
        // Crear un query builder para mayor flexibilidad
        let queryBuilder = Alumno.createQueryBuilder("alumno")
            .leftJoinAndSelect("alumno.responsables", "responsables")
            .leftJoinAndSelect("alumno.asignaciones", "asignaciones")
            .leftJoinAndSelect("asignaciones.estadoAsignacion", "estadoAsignacion")
            .leftJoinAndSelect("asignaciones.gradoCiclo", "gradoCiclo")
            .leftJoinAndSelect("gradoCiclo.ciclo", "ciclo")
            .leftJoinAndSelect("gradoCiclo.grado", "grado")
            .leftJoinAndSelect("grado.jornada", "jornada")
            .leftJoinAndSelect("grado.nivelAcademico", "nivelAcademico");
            
        // Aplicar paginación solo si se proporcionaron los parámetros
        if (isPaginated) {
            const skip = (page! - 1) * limit!;
            queryBuilder = queryBuilder
                .skip(skip)
                .take(limit!);
        }

        // Agregar condición de búsqueda si se proporciona un término
        if (search && search.trim() !== '') {
            try {
                // Eliminar espacios múltiples del término de búsqueda y convertir a minúsculas
                const cleanSearch = search.trim().replace(/\s+/g, ' ').toLowerCase();
                
                // Enfoque simplificado: Buscar en todos los campos relevantes
                queryBuilder = queryBuilder.where(
                    `(LOWER(alumno.cui) LIKE :search OR 
                      LOWER(alumno.primerNombre) LIKE :search OR 
                      LOWER(alumno.segundoNombre) LIKE :search OR 
                      LOWER(alumno.tercerNombre) LIKE :search OR 
                      LOWER(alumno.primerApellido) LIKE :search OR 
                      LOWER(alumno.segundoApellido) LIKE :search OR
                      CONCAT_WS(' ', 
                        LOWER(alumno.primerNombre), 
                        LOWER(alumno.segundoNombre), 
                        LOWER(alumno.tercerNombre), 
                        LOWER(alumno.primerApellido), 
                        LOWER(alumno.segundoApellido)
                      ) LIKE :search)`,
                    { search: `%${cleanSearch}%` }
                );
                
                console.log("Query generado con éxito");
            } catch (error) {
                console.error("Error en la búsqueda:", error);
            }
        }

        // Ejecutar la consulta
        const [alumnos, total] = await queryBuilder.getManyAndCount();

        // Construir la respuesta según si está paginada o no
        const response: any = { 
            message: "Alumnos encontrados", 
            alumnos,
            total
        };
        
        // Agregar información de paginación solo si se solicitó
        if (isPaginated && limit !== null) {
            response.page = page;
            response.totalPages = Math.ceil(total / limit);
        }

        return resp.status(200).json(response);
    } catch (error) {
        console.error("Error fetching alumnos:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
};

export const getAlumno = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { cui } = req.params;

        // Verificar si el alumno ya existe
        const existingAlumno = await Alumno.findOneOrFail({ 
            where: { cui },
            relations: {
                asignaciones: {
                    estadoAsignacion: true,
                    gradoCiclo: {
                        ciclo: true,
                        grado: {
                            jornada: true,
                            nivelAcademico: true
                        }
                    }
                }
            } 
        });

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

        await queryRunner.manager.save(alumnoExistente);

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