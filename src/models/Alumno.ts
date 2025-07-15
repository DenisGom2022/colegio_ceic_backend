import { BaseEntity, Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Genero } from "../utils/genero";
import { Responsable } from "./Responsable";

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

    @OneToMany(() => Responsable, responsable => responsable.alumno)
    responsables:Responsable[];
}