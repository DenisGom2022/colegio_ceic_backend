import { Request, Response } from "express";
import { TipoParentesco } from "../models/TipoParentesco";
import { EntityNotFoundError, Not, QueryFailedError } from "typeorm";

/**
 * Obtiene todos los tipos de parentesco con paginación y búsqueda
 */
export const getAllTiposParentesco = async (req: Request, res: Response): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string || '';
        const skip = (page - 1) * limit;

        // Crear query builder para mayor flexibilidad
        let queryBuilder = TipoParentesco.createQueryBuilder("tipoParentesco")
            .skip(skip)
            .take(limit);

        // Agregar condición de búsqueda si se proporciona
        if (search && search.trim() !== '') {
            const cleanSearch = search.trim().replace(/\s+/g, ' ').toLowerCase();
            queryBuilder = queryBuilder.where(
                "LOWER(tipoParentesco.descripcion) LIKE :search",
                { search: `%${cleanSearch}%` }
            );
        }

        // Ejecutar la consulta
        const [tiposParentesco, total] = await queryBuilder.getManyAndCount();

        res.status(200).json({
            message: "Tipos de parentesco encontrados",
            tiposParentesco,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error al obtener tipos de parentesco:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

/**
 * Obtiene un tipo de parentesco por su ID
 */
export const getTipoParentesco = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        
        // Buscar el tipo de parentesco
        const tipoParentesco = await TipoParentesco.findOneOrFail({
            where: { id: parseInt(id) }
        });

        res.status(200).json({
            message: "Tipo de parentesco encontrado",
            tipoParentesco
        });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Tipo de parentesco no encontrado" });
        }
        console.error("Error al obtener tipo de parentesco:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

/**
 * Crea un nuevo tipo de parentesco
 */
export const crearTipoParentesco = async (req: Request, res: Response): Promise<any> => {
    try {
        const { descripcion } = req.body;

        // Verificar si ya existe un tipo de parentesco con la misma descripción
        const existingTipoParentesco = await TipoParentesco.findOne({
            where: { descripcion }
        });

        if (existingTipoParentesco) {
            return res.status(400).json({ message: "Ya existe un tipo de parentesco con esta descripción" });
        }

        // Crear y guardar el nuevo tipo de parentesco
        const nuevoTipoParentesco = TipoParentesco.create({ descripcion });
        await nuevoTipoParentesco.save();

        res.status(201).json({
            message: "Tipo de parentesco creado exitosamente",
            tipoParentesco: nuevoTipoParentesco
        });
    } catch (error) {
        console.error("Error al crear tipo de parentesco:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

/**
 * Actualiza un tipo de parentesco existente
 */
export const modificarTipoParentesco = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { descripcion } = req.body;

        // Buscar el tipo de parentesco
        const tipoParentesco = await TipoParentesco.findOneOrFail({
            where: { id: parseInt(id) }
        });

        // Verificar si ya existe otro tipo de parentesco con la misma descripción
        const existingTipoParentesco = await TipoParentesco.findOne({
            where: { descripcion, id: Not(parseInt(id)) }
        });

        if (existingTipoParentesco) {
            return res.status(400).json({ message: "Ya existe otro tipo de parentesco con esta descripción" });
        }

        // Actualizar y guardar los cambios
        tipoParentesco.descripcion = descripcion;
        await tipoParentesco.save();

        res.status(200).json({
            message: "Tipo de parentesco actualizado exitosamente",
            tipoParentesco
        });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Tipo de parentesco no encontrado" });
        }
        console.error("Error al modificar tipo de parentesco:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

/**
 * Realiza un soft delete (borrado lógico) de un tipo de parentesco
 */
export const eliminarTipoParentesco = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        // Buscar el tipo de parentesco
        const tipoParentesco = await TipoParentesco.findOneOrFail({
            where: { id: parseInt(id) }
        });

        // Realizar el soft delete
        await TipoParentesco.softRemove(tipoParentesco);

        res.status(200).json({
            message: "Tipo de parentesco eliminado exitosamente"
        });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Tipo de parentesco no encontrado" });
        }
        console.error("Error al eliminar tipo de parentesco:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
