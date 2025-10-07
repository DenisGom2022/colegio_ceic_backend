import { Request, Response } from "express";
import { Bimestre } from "../models/Bimestre";
import { EntityNotFoundError } from "typeorm";

export const iniciarSemestre = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const bimestre = await Bimestre.findOneOrFail({
            where: {
                id
            },
            relations: {
                estado: true,
                ciclo: {
                    bimestres: true
                }
            }
        });

        if (bimestre?.idEstado != 0) return res.status(400).send({ message: "Bimestre no está en espera, estado actual: " + bimestre?.estado?.descripcion });
        if (bimestre?.ciclo?.fechaFin != null) return res.status(400).send({ message: "Ciclo ya finalizado, no se puede iniciar bimestre" });
        if (bimestre?.ciclo?.bimestres?.some((bim) => bim.numeroBimestre < bimestre.numeroBimestre && bim.idEstado != 2)) {
            return res.status(400).send({ message: "No se puede iniciar este bimestre, hay bimestres anteriores que no han sido finalizados" });
        }
        bimestre.idEstado = 1;
        bimestre.estado.id = 1;
        bimestre.fechaInicio = new Date();

        await bimestre.save();

        return res.status(200).send({ message: "Iniciado con éxito" });

    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).send({ message: "Bimestre no existe" });
        }
        console.log("Error al iniciar curso", error);
        return res.status(500).send({ message: "Error al iniciar curso" })
    }

}

export const finalizarSemestre = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id }: any = req.params;
        const bimestre = await Bimestre.findOneOrFail({
            where: {
                id
            },
            relations: {
                estado: true
            }
        });

        if (bimestre?.idEstado != 1) return res.status(400).send({ message: "Bimestre no está en curso, estado actual: " + bimestre?.estado?.descripcion });
       
        bimestre.idEstado = 2;
        bimestre.estado.id = 2;
        bimestre.fechaFin = new Date();

        await bimestre.save();

        return res.status(200).send({ message: "Finalizado con éxito" });

    } catch (error) {
        if (error instanceof EntityNotFoundError) {
            return res.status(404).send({ message: "Bimestre no existe" });
        }
        console.log("Error al finalizar curso", error);
        return res.status(500).send({ message: "Error al finalizar curso" })
    }
}