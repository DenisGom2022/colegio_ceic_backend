import { Usuario } from "../models/Usuario";
import e, { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import { EntityNotFoundError, QueryFailedError, Like } from "typeorm";
import { TipoUsuario } from "../models/TipoUsuario";

export const getAllUsuarios = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string || '';
        const skip = (page - 1) * limit;

        // Crear un query builder para mayor flexibilidad
        let queryBuilder = Usuario.createQueryBuilder("usuario")
            .leftJoinAndSelect("usuario.tipoUsuario", "tipoUsuario")
            .skip(skip)
            .take(limit);

        // Agregar condición de búsqueda si se proporciona un término
        if (search && search.trim() !== '') {
            // Eliminar espacios múltiples del término de búsqueda y convertir a minúsculas
            const cleanSearch = search.trim().replace(/\s+/g, ' ').toLowerCase();
            
            // Dividir el término de búsqueda en palabras individuales
            const searchWords = cleanSearch.split(' ');
            
            if (searchWords.length === 1) {
                // Si solo hay una palabra, búsqueda simple en todos los campos
                queryBuilder = queryBuilder.where(
                    `(LOWER(usuario.usuario) LIKE :searchTerm OR 
                      LOWER(usuario.primer_nombre) LIKE :searchTerm OR 
                      LOWER(usuario.segundo_nombre) LIKE :searchTerm OR 
                      LOWER(usuario.tercer_nombre) LIKE :searchTerm OR 
                      LOWER(usuario.primer_apellido) LIKE :searchTerm OR 
                      LOWER(usuario.segundo_apellido) LIKE :searchTerm)`,
                    { searchTerm: `%${cleanSearch}%` }
                );
            } else {
                // Si hay múltiples palabras, usar un enfoque más simple
                // Para buscar cada palabra por separado en cualquier columna
                const params: Record<string, string> = {};
                let whereClause = '';
                
                // Para cada palabra crear una condición que busca en todos los campos
                searchWords.forEach((word, index) => {
                    if (word.trim() === '') return;
                    
                    const paramName = `searchTerm${index}`;
                    
                    if (whereClause.length > 0) {
                        whereClause += ' AND ';
                    }
                    
                    whereClause += `(
                        LOWER(usuario.usuario) LIKE :${paramName} OR 
                        LOWER(usuario.primer_nombre) LIKE :${paramName} OR 
                        LOWER(usuario.segundo_nombre) LIKE :${paramName} OR 
                        LOWER(usuario.tercer_nombre) LIKE :${paramName} OR 
                        LOWER(usuario.primer_apellido) LIKE :${paramName} OR 
                        LOWER(usuario.segundo_apellido) LIKE :${paramName}
                    )`;
                    
                    params[paramName] = `%${word}%`;
                });
                
                // Aplicar todas las condiciones (cada palabra debe estar presente en alguna columna)
                queryBuilder = queryBuilder.where(whereClause, params);
            }
        }

        // Ejecutar la consulta
        const [usuarios, total] = await queryBuilder.getManyAndCount();

        res.status(200).json({
            message: "usuarios encontrados",
            usuarios,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching usuarios:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const crearUsuario = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { usuario, contrasena, primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido, telefono, idTipoUsuario } = req.body;

        if(idTipoUsuario == 0){
            return resp.status(400).json({ message: "No se puede crear un super usuario" });
        }

        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findOne({ where: { usuario } });
        if (existingUser) {
            return resp.status(400).json({ message: "El usuario ya existe" });
        }

        // Encriptar la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const newUser = Usuario.create({
            usuario,
            contrasena: hashedPassword,
            primerNombre,
            segundoNombre,
            tercerNombre,
            primerApellido,
            segundoApellido,
            telefono,
            idTipoUsuario,
            cambiarContrasena: 1, // Asignar valor por defecto para cambiarContrasena
        });

        await newUser.save();

        resp.status(200).json({
            message: "Usuario creado exitosamente",
            user: newUser
        });
    } catch (error) {
        if (error instanceof QueryFailedError) {
            const { errno, sqlMessage } = error.driverError || {};
            if (errno === 1452 && sqlMessage?.includes("cat_tipo_usuario")) {
            return resp.status(400).json({ message: "Error tipo de usuario no existe" });
            }
            return resp.status(500).json({ message: "Error en BD al modificar usuario" });
        }

        console.error("Error creating usuario:", error);
        resp.status(500).json({ message: "Internal server error" });
    }
}

export const cambiarContrasena = async (req: Request, res: Response): Promise<any> => {
    try {
        const { usuario, contrasenaActual, contrasenaNueva, contrasenaNueva2 } = req.body;
        if (contrasenaNueva != contrasenaNueva2) return res.status(400).send({ message: "Contraseñas no coinciden" });

        const user = await Usuario.findOneOrFail({
            where: {
                usuario,
            }
        });

        const isPasswordValid = await bcrypt.compare(contrasenaActual, user.contrasena);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        user.contrasena = await bcrypt.hash(contrasenaNueva, 10);
        user.cambiarContrasena = 0;

        await user.save();

        return res.send({ message: "Contraseña realizada con exito realizado con éxito" });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const modificarUsuario = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { valorToken } = (req as any);
        const { usuario, primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido, telefono, idTipoUsuario } = req.body;      
        
         if(idTipoUsuario == 0){
            return resp.status(400).json({ message: "No se puede crear un super usuario" });
        }

        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findOneOrFail({ where: { usuario } });

       if( valorToken.role > existingUser.idTipoUsuario ) {
            return resp.status(400).json({ message: "No puedes reiniciar la contraseña de este usuario" });
        }

        existingUser.primerNombre = primerNombre;
        existingUser.segundoApellido = segundoNombre;
        existingUser.tercerNombre = tercerNombre;
        existingUser.primerApellido = primerApellido;
        existingUser.segundoApellido = segundoApellido;
        existingUser.telefono = telefono;
        existingUser.idTipoUsuario = idTipoUsuario;
        if (existingUser.tipoUsuario) {
            existingUser.tipoUsuario.id = idTipoUsuario;
        }


        await existingUser.save();

        return resp.status(200).json({
            message: "Usuario modificado exitosamente"
        });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return resp.status(404).json({ message: "Usuario no encontrado" });
        }

        if (error instanceof QueryFailedError) {
            const { errno, sqlMessage } = error.driverError || {};
            if (errno === 1452 && sqlMessage?.includes("cat_tipo_usuario")) return resp.status(400).json({ message: "Error tipo de usuario no existe" });
            return resp.status(500).json({ message: "Error en BD al modificar usuario" });
        }
        console.error("Error modificando usuario:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
}

export const getUsuario = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { usuario } = req.params;

        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findOneOrFail({ where: { usuario } });

        const { contrasena, ...userWithoutPassword } = existingUser;

        resp.status(200).json({
            message: "Usuario encontrado exitosamente",
            user: userWithoutPassword
        });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return resp.status(404).json({ message: "Usuario no encontrado" });
        }
        console.error("Error creating usuario:", error);
        resp.status(500).json({ message: "Internal server error" });
    }
} 

export const reiniciarContrasena = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { valorToken } = (req as any);
        const { usuario, newContrasena } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findOneOrFail({ where: { usuario } });

        if( valorToken.role > existingUser.idTipoUsuario ) {
            return resp.status(400).json({ message: "No puedes reiniciar la contraseña de este usuario" });
        }

        // Encriptar la contraseña por defecto
        const hashedPassword = await bcrypt.hash(newContrasena, 10);
        existingUser.contrasena = hashedPassword;
        existingUser.cambiarContrasena = 1; // Asignar valor por defecto para cambiarContrasena

        await existingUser.save();

        resp.status(200).json({
            message: "Contraseña reiniciada exitosamente",
            user: existingUser
        });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return resp.status(404).json({ message: "Usuario no encontrado" });
        }
        console.error("Error reiniciando contraseña:", error);
        resp.status(500).json({ message: "Internal server error" });
    }
}

export const getAllTiposUsuario = async (req:Request, resp:Response):Promise<any> => {
    try {
        const tiposUsuario = await TipoUsuario.find();
        return resp.status(200).send({message:"Tipos de usuario obtenidos con exito", tiposUsuario})
    } catch (error) {
        console.error("Error fetching usuarios:", error);
        resp.status(500).json({ message: "Internal server error" });
    }
}

export const eliminarUsuario = async (req: Request, resp: Response): Promise<any> => {
    try {
        const { usuario }: any = req.params;

        // Verificar si el usuario existe
        const existingUsuario = await Usuario.findOneByOrFail({ usuario });

        if(existingUsuario.idTipoUsuario == 0){
            return resp.status(400).json({ message: "No se puede eliminar un super usuario" });
        }

        // Eliminar el usuario
        await Usuario.softRemove(existingUsuario);

        return resp.status(200).json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return resp.status(404).json({ message: "Usuario no encontrado" });
        }
        console.error("Error eliminando usuario:", error);
        return resp.status(500).json({ message: "Internal server error" });
    }
}