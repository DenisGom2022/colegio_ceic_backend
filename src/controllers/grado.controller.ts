import { Request, Response } from "express";
import { Grado } from "../models/Grado";
import { Ciclo } from "../models/Ciclo";
import { GradoCiclo } from "../models/GradoCiclo";
import { AppDataSource } from "../config/data-source";
import { EntityNotFoundError, IsNull, QueryFailedError } from "typeorm";

export const getAllGrados = async (req: Request, res: Response): Promise<any> => {
    try {
        const pageParam = req.query.page as string;
        const limitParam = req.query.limit as string;
        const search = req.query.search as string || '';
        
        // Verificar si se solicitó paginación
        const isPaginated = pageParam !== undefined && limitParam !== undefined;
        const page = isPaginated ? parseInt(pageParam) || 1 : null;
        const limit = isPaginated ? parseInt(limitParam) || 10 : null;
        
        // Crear un query builder para mayor flexibilidad
        let queryBuilder = Grado.createQueryBuilder("grado")
            .leftJoinAndSelect("grado.nivelAcademico", "nivelAcademico")
            .leftJoinAndSelect("grado.jornada", "jornada")
            .leftJoinAndSelect("grado.gradosCiclo", "gradosCiclo")
            .leftJoinAndSelect("gradosCiclo.ciclo", "ciclo");
            
        // Ordenar por jornada y nivel académico (y por nombre de grado como tercero)
        queryBuilder = queryBuilder
            .orderBy("jornada.descripcion", "ASC")
            .addOrderBy("nivelAcademico.descripcion", "ASC")
            .addOrderBy("grado.nombre", "ASC");
            
        // Aplicar paginación solo si se proporcionaron los parámetros
        if (isPaginated && page !== null && limit !== null) {
            const skip = (page - 1) * limit;
            queryBuilder = queryBuilder
                .skip(skip)
                .take(limit);
        }

        // Agregar condición de búsqueda si se proporciona un término
        if (search && search.trim() !== '') {
            try {
                // Eliminar espacios múltiples del término de búsqueda y convertir a minúsculas
                const cleanSearch = search.trim().replace(/\s+/g, ' ').toLowerCase();
                
                // Buscar solo por nombre del grado
                queryBuilder = queryBuilder.where(
                    `LOWER(grado.nombre) LIKE :search`,
                    { search: `%${cleanSearch}%` }
                );
                
                console.log("Query generado con éxito");
            } catch (error) {
                console.error("Error en la búsqueda:", error);
            }
        }

        // Ejecutar la consulta
        const [grados, total] = await queryBuilder.getManyAndCount();

        // Construir la respuesta según si está paginada o no
        const response: any = { 
            message: "Grados obtenidos exitosamente", 
            grados,
            total
        };
        
        // Agregar información de paginación solo si se solicitó
        if (isPaginated && limit !== null) {
            response.page = page;
            response.totalPages = Math.ceil(total / limit);
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error("Error obteniendo grados:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getGrado = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const grado = await Grado.findOneOrFail({ 
            where: { id: Number(id) }, 
            relations: [
                "nivelAcademico", 
                "jornada", 
                "gradosCiclo", 
                "gradosCiclo.ciclo", 
                "gradosCiclo.cursos",
                "gradosCiclo.cursos.catedratico"
            ] 
        });

        // Separar ciclos activos y finalizados
        const ciclosActivos = [];
        const ciclosFinalizados = [];
        for (const gc of grado.gradosCiclo) {
            if (gc.ciclo && gc.ciclo.fechaFin === null) {
                ciclosActivos.push(gc);
            } else {
                ciclosFinalizados.push(gc);
            }
        }
        // Crear un nuevo objeto para la respuesta sin mutar el grado original
        const gradoResponse = {
            ...grado,
            gradosCiclo: undefined,
            ciclosActivos,
            ciclosFinalizados
        };
        return res.status(200).json({ 
            message: "Grado obtenido exitosamente", 
            grado: gradoResponse
        });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Grado no encontrado" });
        }
        console.error("Error obteniendo grado:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const crearGrado = async (req: Request, res: Response): Promise<any> => {
    try {
        const { nombre, idNivel, idJornada } = req.body;
        const gradoExistente = await Grado.findOne({ where: { nombre, idNivel, idJornada } });
        if (gradoExistente) {
            return res.status(400).json({ message: "Ya existe un grado con esos datos" });
        }
        const grado = new Grado();
        grado.nombre = nombre;
        grado.idNivel = idNivel;
        grado.idJornada = idJornada;
        await grado.save();
        return res.status(201).json({ message: "Grado creado exitosamente", grado });
    } catch (error) {
        if (error instanceof QueryFailedError) {
            const { errno, sqlMessage } = error.driverError || {};
            if (errno === 1452 && sqlMessage?.includes("FK_alumno_jornada")) {
                return res.status(404).json({ message: "Jornada no existe" });
            }
            if (errno === 1452 && sqlMessage?.includes("FK_alumno_nivel")) {
                return res.status(404).json({ message: "Nivel no existe" });
            }
            console.log("Error en BD al modificar usuario: ", error);
            return res.status(500).json({ message: "Error en BD al modificar usuario" });
        }
        console.error("Error creando grado:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const modificarGrado = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id, nombre, idNivel, idJornada } = req.body;
        const grado = await Grado.findOneByOrFail({ id: Number(id) });
        grado.nombre = nombre;
        grado.idNivel = idNivel;
        grado.idJornada = idJornada;
        await grado.save();
        return res.status(200).json({ message: "Grado modificado exitosamente", grado });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Grado no encontrado" });
        }
        if (error instanceof QueryFailedError) {
            const { errno, sqlMessage } = error.driverError || {};
            if (errno === 1452 && sqlMessage?.includes("FK_alumno_jornada")) {
                return res.status(404).json({ message: "Jornada no existe" });
            }
            if (errno === 1452 && sqlMessage?.includes("FK_alumno_nivel")) {
                return res.status(404).json({ message: "Nivel no existe" });
            }
            console.log("Error en BD al modificar usuario: ", error);
            return res.status(500).json({ message: "Error en BD al modificar usuario" });
        }
        console.error("Error modificando grado:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const eliminarGrado = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const grado = await Grado.findOneByOrFail({ id: Number(id) });
        await grado.softRemove();
        return res.status(200).json({ message: "Grado eliminado exitosamente" });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Grado no encontrado" });
        }
        console.error("Error eliminando grado:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const asignarGradoACicloActual = async (req: Request, res: Response): Promise<any> => {
    const queryRunner = AppDataSource.createQueryRunner();
    
    try {
        // Conectar el queryRunner al inicio
        await queryRunner.connect();
        
        const { idGrado, precioPago, cantidadPagos, precioInscripcion } = req.body;
        
        // Crear repositorios
        const gradoRepo = AppDataSource.getRepository(Grado);
        const cicloRepo = AppDataSource.getRepository(Ciclo);
        const gradoCicloRepo = AppDataSource.getRepository(GradoCiclo);
        
        // Validar que el grado existe
        const grado = await gradoRepo.findOneByOrFail({ id: Number(idGrado) });
        
        // Buscar el ciclo activo (con fechaFin = null)
        const cicloActivo = await cicloRepo.findOneBy({ fechaFin: IsNull() });
        if (!cicloActivo) {
            return res.status(404).json({ message: "No hay un ciclo activo en este momento" });
        }
        
        // Verificar si ya existe la asignación
        const asignacionExistente = await gradoCicloRepo.findOne({ 
            where: { 
                idGrado: grado.id,
                idCiclo: cicloActivo.id
            } 
        });
        
        if (asignacionExistente) {
            return res.status(400).json({ 
                message: "Este grado ya está asignado al ciclo actual",
                asignacion: asignacionExistente
            });
        }
        
        // Iniciar la transacción
        await queryRunner.startTransaction();
        
        const nuevaAsignacion = new GradoCiclo();
        nuevaAsignacion.idGrado = grado.id;
        nuevaAsignacion.idCiclo = cicloActivo.id;
        nuevaAsignacion.precioPago = precioPago;
        nuevaAsignacion.cantidadPagos = cantidadPagos;
        nuevaAsignacion.precioInscripcion = precioInscripcion;
        
        await queryRunner.manager.save(nuevaAsignacion);
        await queryRunner.commitTransaction();
        
        // Obtener el grado actualizado con sus relaciones
        const gradoActualizado = await gradoRepo.findOne({ 
            where: { id: grado.id },
            relations: ["nivelAcademico", "jornada", "gradosCiclo", "gradosCiclo.ciclo"]
        });
        
        return res.status(201).json({ 
            message: "Grado asignado exitosamente al ciclo actual", 
            grado: gradoActualizado,
            ciclo: cicloActivo
        });
    } catch (error) {
        // Solo hacer rollback si la transacción está activa
        if (queryRunner.isTransactionActive) {
            await queryRunner.rollbackTransaction();
        }
        
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Grado no encontrado" });
        }
        if (error instanceof QueryFailedError) {
            console.log("Error en BD al asignar grado al ciclo: ", error);
            return res.status(500).json({ message: "Error en BD al asignar grado al ciclo" });
        }
        
        console.error("Error asignando grado a ciclo:", error);
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        // Solo liberar el queryRunner si se conectó
        if (queryRunner && queryRunner.isReleased === false) {
            await queryRunner.release();
        }
    }
};
