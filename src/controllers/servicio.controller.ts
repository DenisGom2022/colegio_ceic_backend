import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Servicio } from "../models/Servicio";
import { GradoCiclo } from "../models/GradoCiclo";
import { EntityNotFoundError, QueryFailedError } from "typeorm";

export const crearServicio = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { descripcion, valor, fecha_a_pagar, id_grado_ciclo } = req.body;

        // Validar que el gradoCiclo existe
        const gradoCicloRepository = AppDataSource.getRepository(GradoCiclo);
        const gradoCiclo = await gradoCicloRepository.findOne({ where: { id: id_grado_ciclo } });
        if (!gradoCiclo) {
            return resp.status(404).json({ message: "Grado Ciclo no encontrado" });
        }

        const servicioRepository = AppDataSource.getRepository(Servicio);
        const servicio = servicioRepository.create({
            descripcion,
            valor,
            fecha_a_pagar: new Date(fecha_a_pagar),
            id_grado_ciclo
        });

        await servicioRepository.save(servicio);

        return resp.status(201).json({ 
            message: "Servicio creado exitosamente", 
            servicio 
        });
    } catch (error) {
        if (error instanceof QueryFailedError) {
            console.log("Error en BD al crear servicio: ", error);
            return resp.status(500).json({ message: "Error en BD al crear servicio" });
        }
        console.error("Error creating servicio:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
};

export const getAllServicios = async (req: Request, resp: Response): Promise<any> => {
    try {
        const servicioRepository = AppDataSource.getRepository(Servicio);
        const servicios = await servicioRepository.find({
            relations: {
                gradoCiclo: {
                    grado: {
                        jornada: true,
                        nivelAcademico: true
                    },
                    ciclo: true
                }
            }
        });

        return resp.status(200).json({
            message: "Servicios encontrados",
            servicios,
            total: servicios.length
        });
    } catch (error) {
        console.error("Error fetching servicios:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
};

export const getServiciosByGradoCiclo = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { id_grado_ciclo } = req.params;

        // Validar que el gradoCiclo existe
        const gradoCicloRepository = AppDataSource.getRepository(GradoCiclo);
        const gradoCiclo = await gradoCicloRepository.findOne({ 
            where: { id: parseInt(id_grado_ciclo) },
            relations: {
                grado: {
                    jornada: true,
                    nivelAcademico: true
                },
                ciclo: true
            }
        });

        if (!gradoCiclo) {
            return resp.status(404).json({ message: "Grado Ciclo no encontrado" });
        }

        // Obtener todos los servicios para el gradoCiclo especificado
        const servicioRepository = AppDataSource.getRepository(Servicio);
        const servicios = await servicioRepository.find({
            where: { id_grado_ciclo: parseInt(id_grado_ciclo) },
            relations: {
                gradoCiclo: {
                    grado: {
                        jornada: true,
                        nivelAcademico: true
                    },
                    ciclo: true
                }
            },
            order: {
                fecha_a_pagar: 'ASC'
            }
        });

        return resp.status(200).json({
            message: "Servicios encontrados para el grado ciclo",
            gradoCiclo,
            servicios,
            total: servicios.length
        });
    } catch (error) {
        console.error("Error fetching servicios by grado ciclo:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
};

export const getServicio = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const servicioRepository = AppDataSource.getRepository(Servicio);
        const servicio = await servicioRepository.findOne({
            where: { id: parseInt(id) },
            relations: {
                gradoCiclo: {
                    grado: {
                        jornada: true,
                        nivelAcademico: true
                    },
                    ciclo: true
                }
            }
        });

        if (!servicio) {
            return resp.status(404).json({ message: "Servicio no encontrado" });
        }

        return resp.status(200).json({
            message: "Servicio encontrado exitosamente",
            servicio
        });
    } catch (error) {
        console.error("Error fetching servicio:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
};

export const modificarServicio = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { descripcion, valor, fecha_a_pagar, id_grado_ciclo } = req.body;

        const servicioRepository = AppDataSource.getRepository(Servicio);
        const servicioExistente = await servicioRepository.findOne({
            where: { id: parseInt(id) }
        });

        if (!servicioExistente) {
            return resp.status(404).json({ message: "Servicio no encontrado" });
        }

        // Si se va a cambiar el gradoCiclo, validar que existe
        if (id_grado_ciclo && id_grado_ciclo !== servicioExistente.id_grado_ciclo) {
            const gradoCicloRepository = AppDataSource.getRepository(GradoCiclo);
            const gradoCiclo = await gradoCicloRepository.findOne({ where: { id: id_grado_ciclo } });
            if (!gradoCiclo) {
                return resp.status(404).json({ message: "Grado Ciclo no encontrado" });
            }
        }

        servicioExistente.descripcion = descripcion || servicioExistente.descripcion;
        servicioExistente.valor = valor || servicioExistente.valor;
        servicioExistente.fecha_a_pagar = fecha_a_pagar ? new Date(fecha_a_pagar) : servicioExistente.fecha_a_pagar;
        servicioExistente.id_grado_ciclo = id_grado_ciclo || servicioExistente.id_grado_ciclo;

        await servicioRepository.save(servicioExistente);

        return resp.status(200).json({
            message: "Servicio modificado exitosamente",
            servicio: servicioExistente
        });
    } catch (error) {
        if (error instanceof QueryFailedError) {
            console.log("Error en BD al modificar servicio: ", error);
            return resp.status(500).json({ message: "Error en BD al modificar servicio" });
        }
        console.error("Error updating servicio:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
};

export const eliminarServicio = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const servicioRepository = AppDataSource.getRepository(Servicio);
        const servicioExistente = await servicioRepository.findOne({
            where: { id: parseInt(id) }
        });

        if (!servicioExistente) {
            return resp.status(404).json({ message: "Servicio no encontrado" });
        }

        await servicioRepository.softRemove(servicioExistente);

        return resp.status(200).json({
            message: "Servicio eliminado exitosamente",
            servicio: servicioExistente
        });
    } catch (error) {
        console.error("Error deleting servicio:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
};
