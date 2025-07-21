import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Grado } from "./Grado";
import { Ciclo } from "./Ciclo";

@Entity({ name: "grado_ciclo" })
export class GradoCiclo {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "id_grado" })
    idGrado: number;

    @Column({ name: "id_ciclo" })
    idCiclo: number;

    @Column({ name: "precio_pago", type: "decimal", precision: 10, scale: 2 })
    precioPago: number;

    @Column({ name: "cantidad_pagos", type: "int" })
    cantidadPagos: number;

    @Column({ name: "precio_inscripcion", type: "decimal", precision: 10, scale: 2 })
    precioInscripcion: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt?: Date;

    @ManyToOne(() => Grado)
    @JoinColumn({ name: "id_grado" })
    grado: Grado;

    @ManyToOne(() => Ciclo)
    @JoinColumn({ name: "id_ciclo" })
    ciclo: Ciclo;
}
