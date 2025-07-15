import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Alumno } from "../models/Alumno";
import { Responsable } from "../models/Responsable";

export const crearAlumno = async (req:Request , resp:Response):Promise<any> => {
    const queryRunner = AppDataSource.createQueryRunner();
    try {
        const { cui, primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido, telefono, genero, responsables } = req.body;
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

        const newResponsables = responsables.map((responsable:Responsable) => {
            const newResponsable = new Responsable();
            newResponsable.idResponsable = responsable.idResponsable;
            newResponsable.primerNombre = responsable.primerNombre;
            newResponsable.segundoNombre = responsable.segundoNombre;
            newResponsable.tercerNombre = responsable.tercerNombre;
            newResponsable.primerApellido = responsable.primerApellido;
            newResponsable.segundoApellido = responsable.segundoApellido;
            newResponsable.telefono = responsable.telefono;
            newResponsable.idParentesco = responsable.idParentesco;
            newResponsable.alumno = alumno;
            return newResponsable;
        })

        await Promise.all(
            newResponsables.map((r:any) => queryRunner.manager.save(r))
        );        
        await queryRunner.commitTransaction();
        return resp.status(200).send({ message: "Alumno almacenado con exito" })
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error("Error during login:", error);
        return resp.status(500).json({ message: "Internal server error" });
    } finally {
        await queryRunner.release();
    }
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