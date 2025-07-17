import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BaseEntity } from "typeorm";
import { NivelAcademico } from "./NivelAcademico";
import { Jornada } from "./Jornada";

@Entity({ name: "grado" })
export class Grado extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "nombre", type: "varchar", length: 255 })
    nombre: string;

    @Column({ name: "id_nivel" })
    idNivel: number;

    @Column({ name: "id_jornada" })
    idJornada: number;

    @ManyToOne(() => NivelAcademico)
    @JoinColumn({ name: "id_nivel" })
    nivelAcademico: NivelAcademico;

    @ManyToOne(() => Jornada)
    @JoinColumn({ name: "id_jornada" })
    jornada: Jornada;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt?: Date;
}
