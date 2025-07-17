import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "cat_nivel_academico" })
export class NivelAcademico {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "descripcion", type: "varchar", length: 255 })
    descripcion: string;
}
