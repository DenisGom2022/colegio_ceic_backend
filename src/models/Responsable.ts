import { BaseEntity, Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Alumno } from "./Alumno";
import { TipoParentesco } from "./TipoParentesco";

@Entity({ name: "responsable" })
export class Responsable extends BaseEntity {
    @PrimaryColumn({ name: "id_responsable", type: "nvarchar" })
    idResponsable: string;

    @Column({ name: "primer_nombre", type: "nvarchar", length: 100 })
    primerNombre: string;

    @Column({ name: "segundo_nombre", type: "nvarchar", length: 100, nullable: true })
    segundoNombre?: string;

    @Column({ name: "tercer_nombre", type: "nvarchar", length: 100, nullable: true })
    tercerNombre?: string;

    @Column({ name: "primer_apellido", type: "nvarchar", length: 100 })
    primerApellido: string;

    @Column({ name: "segundo_apellido", type: "nvarchar", length: 100, nullable: true })
    segundoApellido?: string;

    @Column({ name: "telefono", type: "nvarchar", length: 20, nullable: true })
    telefono?: string;

    @Column({ name: "id_parentesco", type: "int" })
    idParentesco: number;

    @Column({ name: "cui_alumno", type: "nvarchar", length: 20 })
    cuiAlumno: string;

    @ManyToOne(() => Alumno, alumno => alumno.responsables, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "cui_alumno", referencedColumnName: "cui" })
    alumno: Alumno;

    @ManyToOne(() => TipoParentesco, parentesco => parentesco.id, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "id_parentesco", referencedColumnName: "id" })
    parentesco: TipoParentesco;
}