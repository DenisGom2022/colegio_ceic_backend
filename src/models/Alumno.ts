import { BaseEntity, Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Genero } from "../utils/genero";
import { Responsable } from "./Responsable";
import { AsignacionAlumno } from "./AsignacionAlumno";

@Entity("alumno")
export class Alumno extends BaseEntity {
    @PrimaryColumn({ type: "nvarchar", length: 20, name: "cui" })
    cui: string;

    @Column({ type: "nvarchar", length: 100, name: "primer_nombre" })
    primerNombre: string;

    @Column({ type: "nvarchar", length: 100, nullable: true, name: "segundo_nombre" })
    segundoNombre?: string;

    @Column({ type: "nvarchar", length: 100, nullable: true, name: "tercer_nombre" })
    tercerNombre?: string;

    @Column({ type: "nvarchar", length: 100, name: "primer_apellido" })
    primerApellido: string;

    @Column({ type: "nvarchar", length: 100, nullable: true, name: "segundo_apellido" })
    segundoApellido?: string;

    @Column({ type: "nvarchar", length: 20, nullable: true, name: "telefono" })
    telefono?: string;

    @Column({ type: "enum", enum: Genero, name: "genero" })
    genero: Genero;

    @CreateDateColumn({ type: "datetime", name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ type: "datetime", name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ type: "datetime", name: "deleted_at", nullable: true })
    deletedAt?: Date;

    @OneToMany(() => Responsable, responsable => responsable.alumno, {eager:true})
    responsables: Responsable[];

    @OneToMany(() => AsignacionAlumno, asginacion => asginacion.alumno)
    asignaciones:AsignacionAlumno;
}