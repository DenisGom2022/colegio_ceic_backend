/**
 * Crea un nuevo pago
 * Espera en el body: idAsignacionCurso, tipoPagoId, numeroPago, valor, mora, fechaPago
 */
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
    } catch (error) {
        console.log("Error al crear pago", error);
        return res.status(500).send({ message: "Error al crear pago" });
    }
}

import { Request, Response } from "express";
import { Pago } from "../models/Pago";

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
