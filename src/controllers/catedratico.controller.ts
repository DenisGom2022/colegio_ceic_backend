import { Request, Response } from "express";
import { Catedratico } from "../models/Catedratico";
import { EntityNotFoundError, QueryFailedError } from "typeorm";
import { Usuario } from "../models/Usuario";

export const createCatedratico = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { dpi, idUsuario } = req.body;
        // buscar si ya existe el catedrático
        const existingCatedratico = await Catedratico.findOneBy({ dpi });
        if (existingCatedratico) {
            return resp.status(400).json({ message: "El catedrático ya existe" });
        }
        const newCatedratico = new Catedratico();
        newCatedratico.dpi = dpi;
        newCatedratico.idUsuario = idUsuario;
        await newCatedratico.save();
        return resp.send({ message: "Catedratico guardado con éxito" });
    } catch (error) {
        if (error instanceof QueryFailedError) {
            const { errno, sqlMessage } = error.driverError || {};
            if (errno === 1062 && sqlMessage?.includes("IDX_UNIQUE_ID_USUARIO")) {
                return resp.status(400).json({ message: "Usuario ya pertenece a un catedrático" });
            }
            if (errno === 1452 && sqlMessage?.includes("FK_id_usuario")) {
                return resp.status(404).json({ message: "Usuario no existe" });
            }
            console.log("Error en BD al modificar Catedrático: ", error);
            return resp.status(500).json({ message: "Error en BD al modificar Catedrático" });
        }
        console.error("Error fetching Catedrático:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
}

export const getAllCatedraticos = async (req: Request, resp: Response): Promise<any> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string || '';
        const skip = (page - 1) * limit;

        // Crear un query builder para mayor flexibilidad
        let queryBuilder = Catedratico.createQueryBuilder("catedratico")
            .leftJoinAndSelect("catedratico.usuario", "usuario")
            .skip(skip)
            .take(limit);

        // Agregar condición de búsqueda si se proporciona un término
        if (search && search.trim() !== '') {
            try {
                // Eliminar espacios múltiples del término de búsqueda y convertir a minúsculas
                const cleanSearch = search.trim().replace(/\s+/g, ' ').toLowerCase();
                
                // Enfoque simplificado: Buscar en todos los campos relevantes
                queryBuilder = queryBuilder.where(
                    `(LOWER(catedratico.dpi) LIKE :search OR 
                      LOWER(usuario.usuario) LIKE :search OR
                      LOWER(usuario.primer_nombre) LIKE :search OR 
                      LOWER(usuario.segundo_nombre) LIKE :search OR 
                      LOWER(usuario.tercer_nombre) LIKE :search OR 
                      LOWER(usuario.primer_apellido) LIKE :search OR 
                      LOWER(usuario.segundo_apellido) LIKE :search OR
                      CONCAT_WS(' ', 
                        LOWER(usuario.primer_nombre), 
                        LOWER(usuario.segundo_nombre), 
                        LOWER(usuario.tercer_nombre), 
                        LOWER(usuario.primer_apellido), 
                        LOWER(usuario.segundo_apellido)
                      ) LIKE :search)`,
                    { search: `%${cleanSearch}%` }
                );
                
                console.log("Query generado con éxito");
            } catch (error) {
                console.error("Error en la búsqueda:", error);
            }
        }

        // Ejecutar la consulta
        const [catedraticos, total] = await queryBuilder.getManyAndCount();

        // Eliminar contraseñas de los resultados
        const catedraticosWhitoutPassword = catedraticos.map(catedratico => {
            if (catedratico.usuario) {
                const { contrasena, ...usuarioWhitoutPassword } = catedratico.usuario;
                return { ...catedratico, usuario: usuarioWhitoutPassword };
            }
            return catedratico;
        });

        return resp.status(200).json({ 
            message: "Catedráticos encontrados", 
            catedraticos: catedraticosWhitoutPassword,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching Catedráticos:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
};

export const getCatedratico = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { dpi } = req.params;

        // Buscar el catedrático incluyendo la relación del ciclo dentro de gradoCiclo
        const existingCatedratico = await Catedratico.findOneOrFail({ 
            where: { dpi },
            relations: {
                cursos: {
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

        // Separar cursos por ciclo activo (fechaFin === null) y ciclos finalizados
        const cursosActivos: any[] = [];
        const cursosFinalizados: any[] = [];

        for (const curso of existingCatedratico.cursos || []) {
            const ciclo = curso.gradoCiclo?.ciclo;
            if (ciclo && ciclo.fechaFin === null) {
                cursosActivos.push(curso);
            } else {
                cursosFinalizados.push(curso);
            }
        }

        // Eliminar la contraseña del usuario antes de devolver la respuesta
        const usuario = existingCatedratico.usuario;
        const { contrasena, ...usuarioWhitoutPassword } = usuario || {};

        // Construir objeto de respuesta sin exponer la contraseña ni la lista original de cursos
        const catedraticoWhitoutPassword = {
            ...existingCatedratico,
            usuario: usuarioWhitoutPassword,
            cursos: undefined // evitar devolver la lista original completa
        };

        return resp.status(200).json({
            message: "Catedrático encontrado exitosamente",
            catedratico: catedraticoWhitoutPassword,
            cursosActivos,
            cursosFinalizados
        });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return resp.status(404).json({ message: "Catedratico no encontrado" });
        }
        console.error("Error creating Catedrático:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
};


export const modificarCatedratico = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { dpi, idUsuario } = req.body;

        // Verificar si el usuario ya existe
        const existingCatedratico = await Catedratico.findOneOrFail({ where: { dpi } });

        existingCatedratico.idUsuario = idUsuario;
        if (existingCatedratico.usuario) {
            existingCatedratico.usuario.usuario = idUsuario;
        }
        await existingCatedratico.save();

        return resp.status(200).json({
            message: "Catedrático modificado exitosamente"
        });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return resp.status(404).json({ message: "Catedrático no encontrado" });
        }

        if (error instanceof QueryFailedError) {
            const { errno, sqlMessage } = error.driverError || {};
            if (errno === 1062 && sqlMessage?.includes("IDX_UNIQUE_ID_USUARIO")) {
                return resp.status(400).json({ message: "Usuario ya pertenece a un catedrático" });
            }
            if (errno === 1452 && sqlMessage?.includes("FK_id_usuario")) {
                return resp.status(404).json({ message: "Usuario no existe" });
            }
            console.log("Error en BD al modificar Catedrático: ", error);
            return resp.status(500).json({ message: "Error en BD al modificar usuario" });
        }
        console.error("Error modificando Catedrático:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Realiza un soft delete (borrado lógico) de un catedrático
 * Esto marca el registro como eliminado sin borrarlo físicamente de la BD
 */
export const eliminarCatedratico = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { dpi } = req.params;

        // Verificar si el catedrático existe
        const existingCatedratico = await Catedratico.findOneOrFail({ where: { dpi } });
        
        // Realizar el soft delete
        await Catedratico.softRemove(existingCatedratico);

        return resp.status(200).json({
            message: "Catedrático eliminado exitosamente"
        });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return resp.status(404).json({ message: "Catedrático no encontrado" });
        }

        console.error("Error eliminando Catedrático:", error);
        return resp.status(500).json({ message: "Error interno del servidor" });
    }
}


