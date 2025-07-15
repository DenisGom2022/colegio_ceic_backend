import { Usuario } from "../models/Usuario";
import e, { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import { EntityNotFoundError, QueryFailedError } from "typeorm";
import { TipoUsuario } from "../models/TipoUsuario";

export const getAllUsuarios = async (req: Request, res: Response) => {
    try {
        const usuarios = await findUsers();
        res.status(200).json({ message: "usuarios encontrados", usuarios });
    } catch (error) {
        console.error("Error fetching usuarios:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const findUsers = async () => {
    return await Usuario.find({
        select: {
            usuario: true,
            primerNombre: true,
            segundoNombre: true,
            tercerNombre: true,
            primerApellido: true,
            segundoApellido: true,
            telefono: true,
            createdAt: true,
            updatedAt: true,
            tipoUsuario: {
                id: true,
                descripcion: true,
            },
            cambiarContrasena: true,
        },
    });
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

        console.log("valorToken", valorToken);

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