import { Request, Response } from "express";
import { Ciclo } from "../models/Ciclo";
import { AppDataSource } from "../config/data-source";
import { EntityNotFoundError, IsNull } from "typeorm";
import { Bimestre } from "../models/Bimestre";

const cicloRepo = AppDataSource.getRepository(Ciclo);

export const getAllCiclos = async (req: Request, res: Response): Promise<any> => {
    try {
        const ciclos = await cicloRepo.find({
            relations: {
                gradosCiclo: {
                    grado: {
                        nivelAcademico: true,
                        jornada: true
                    }
                }
            },
            order: {
                createdAt: "DESC"
            }
        });
        return res.status(200).json({ message: "Ciclos obtenidos exitosamente", ciclos });
    } catch (error) {
        console.error("Error obteniendo ciclos:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getCiclo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const ciclo = await cicloRepo.findOneOrFail({
            where: { id },
            relations: {
                gradosCiclo: {
                    grado: {
                        nivelAcademico: true,
                        jornada: true
                    }
                },
                bimestres: {
                    estado: true
                }
            },
            order: {
                createdAt: "DESC"
            }
        });
        return res.status(200).json({ message: "Ciclo obtenido exitosamente", ciclo });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Ciclo no encontrado" });
        }
        console.error("Error obteniendo ciclo:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const crearCiclo = async (req: Request, res: Response): Promise<any> => {
    const queryRunner = AppDataSource.createQueryRunner();
    try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const { id, cantidadBimestres, descripcion } = req.body;

        const existingCiclo = await cicloRepo.findOneBy({ id });
        if (existingCiclo) {
            return res.status(400).json({ message: "El ciclo ya existe" });
        }
        const cicloActivo = await cicloRepo.findOneBy({ fechaFin: IsNull() });
        if (cicloActivo) {
            return res.status(400).json({ message: "Ya se encuentra un ciclo activo, finalicelo para iniciar otro" });
        }
        const ciclo = cicloRepo.create({ id, descripcion });
        await queryRunner.manager.save(ciclo);

        for (let i = 0; i < cantidadBimestres; i++) {
            const bimestre = new Bimestre();
            bimestre.numeroBimestre = i + 1;
            bimestre.idEstado = 0;
            bimestre.fechaInicio = null;
            bimestre.ciclo = ciclo;
            await queryRunner.manager.save(bimestre);
        }
        await queryRunner.commitTransaction();
        return res.status(200).json({ message: "Ciclo creado exitosamente", ciclo });
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error("Error creando ciclo:", error);
        return res.status(500).json({ message: "Internal server error" });
    }finally {
        await queryRunner.release();
    }
};

export const modificarCiclo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id, descripcion } = req.body;
        const ciclo = await cicloRepo.findOneByOrFail({ id });
        if (ciclo.fechaFin != null) {
            return res.status(400).json({ message: "Ciclo finalizado no se puede modificar", ciclo });
        }
        ciclo.descripcion = descripcion;
        await cicloRepo.save(ciclo);
        return res.status(200).json({ message: "Ciclo modificado exitosamente", ciclo });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Ciclo no encontrado" });
        }
        console.error("Error modificando ciclo:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const eliminarCiclo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const ciclo = await cicloRepo.findOneOrFail({
            where: { id },
            relations: {
                gradosCiclo: true
            }
        });
        if (ciclo.fechaFin != null) {
            return res.status(400).json({ message: "Ciclo finalizado no se puede eliminar", ciclo });
        }
        if (ciclo?.gradosCiclo?.length > 0) {
            return res.status(400).json({ message: "Ciclo tiene grados relacionados no se puede eliminar", ciclo });
        }
        await cicloRepo.softRemove(ciclo);
        return res.status(200).json({ message: "Ciclo eliminado exitosamente" });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Ciclo no encontrado" });
        }
        console.error("Error eliminando ciclo:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const finalizaCiclo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const ciclo = await cicloRepo.findOneByOrFail({ id });
        if (ciclo.fechaFin != null) {
            return res.status(400).json({ message: "Ciclo ya ha finalizado" });
        }
        ciclo.fechaFin = new Date();
        await cicloRepo.save(ciclo);
        return res.status(200).json({ message: "Ciclo finalizado exitosamente" });
    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).json({ message: "Ciclo no encontrado" });
        }
        console.error("Error finalizar ciclo:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
