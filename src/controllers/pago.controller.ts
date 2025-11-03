import { Request, Response } from "express";
import { Pago } from "../models/Pago";
import { AsignacionAlumno } from "../models/AsignacionAlumno";

export const createPago = async (req: Request, res: Response): Promise<any> => {
    try {
        const {
            idAsignacionCurso,
            tipoPagoId,
            numeroPago,
            valor,
            mora,
            fechaPago
        } = req.body;

        // Validar que la asignación existe y está en ciclo actual
        const asignacion = await AsignacionAlumno.findOne({
            where: { id: idAsignacionCurso },
            relations: {
                gradoCiclo: { ciclo: true }
            }
        });
        if (!asignacion) {
            return res.status(404).send({ message: "La asignación no existe" });
        }
        if (!asignacion.gradoCiclo || !asignacion.gradoCiclo.ciclo || asignacion.gradoCiclo.ciclo.fechaFin !== null) {
            return res.status(400).send({ message: "La asignación no pertenece al ciclo actual" });
        }

        // Validar monto según tipo de pago
        if (tipoPagoId === 1) {
            // Tipo de pago 1: Inscripción - validar que el monto sea igual al precio de inscripción
            if (valor != asignacion.gradoCiclo.precioInscripcion) {
                return res.status(400).send({ 
                    message: `El monto debe ser igual al precio de inscripción: ${asignacion.gradoCiclo.precioInscripcion}` 
                });
            }
        } else if (tipoPagoId === 2) {
            // Tipo de pago 2: Mensualidad - validar que el monto sea igual al precio de pago
            if (valor != asignacion.gradoCiclo.precioPago) {
                return res.status(400).send({ 
                    message: `El monto debe ser igual al precio de pago: ${asignacion.gradoCiclo.precioPago}` 
                });
            }
        }

        const pago = Pago.create({
            asignacionCursoId: idAsignacionCurso,
            tipoPagoId,
            numeroPago,
            valor,
            mora,
            fechaPago
        });

        await pago.save();

        return res.status(200).send({ message: "Pago creado con éxito", pago });
    } catch (error: any) {
        
        // Validar error de clave foránea tipo de pago
        if (error.code === 'ER_NO_REFERENCED_ROW_2' && error.sqlMessage && error.sqlMessage.includes('FK_pagos_tiposPago')) {
            return res.status(400).send({ message: "El tipo de pago no existe" });
        }
        console.log("Error al crear pago", error);
        return res.status(500).send({ message: "Error al crear pago" });
    }
}

export const getPagos = async (req: Request, res: Response): Promise<any> => {
    try {
        // Parámetros de paginación y filtros
        const page = req.query.page ? parseInt(req.query.page as string) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
        const skip = page && limit ? (page - 1) * limit : undefined;
        const cui = req.query.cui as string | undefined; // Filtro por CUI de alumno
        const fechaInicio = req.query.fechaInicio as string | undefined; // Filtro por fecha inicial
        const fechaFin = req.query.fechaFin as string | undefined; // Filtro por fecha final

        // Construcción de la consulta con joins y filtros
        const query = Pago.createQueryBuilder("pago")
            .leftJoinAndSelect("pago.asignacionCurso", "asignacionCurso")
            .orderBy("pago.id", "DESC");

        // Filtro por CUI si se envía
        if (cui) {
            query.andWhere("asignacionCurso.cui = :cui", { cui });
        }
        // Filtro por rango de fechas si se envía
        if (fechaInicio && fechaFin) {
            query.andWhere("pago.fechaPago BETWEEN :fechaInicio AND :fechaFin", { fechaInicio, fechaFin });
        } else if (fechaInicio) {
            query.andWhere("pago.fechaPago >= :fechaInicio", { fechaInicio });
        } else if (fechaFin) {
            query.andWhere("pago.fechaPago <= :fechaFin", { fechaFin });
        }

        let pagos, total;
        // Si hay paginación, obtener el total y los pagos paginados
        if (page && limit) {
            query.skip(skip!).take(limit);
            [pagos, total] = await query.getManyAndCount();
        } else {
            // Si no hay paginación, obtener todos los pagos filtrados
            pagos = await query.getMany();
            total = pagos.length;
        }

        // Construcción de la respuesta
        const responseObj: any = {
            message: "Pagos encontrados con éxito",
            pagos,
            total
        };
        // Agregar info de paginación si corresponde
        if (page && limit) {
            responseObj.page = page;
            responseObj.limit = limit;
            responseObj.totalPages = Math.ceil(total / limit);
        }

        return res.send(responseObj);
    } catch (error) {
        // Log de error y respuesta genérica
        console.log("Error al buscar pagos", error);
        return res.send({ message: "Error al buscar pagos" });
    }
}
