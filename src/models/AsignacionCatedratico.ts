import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { GradoCiclo } from "./GradoCiclo";
import { Catedratico } from "./Catedratico";
import { Curso } from "./Curso";

@Entity({ name: "asignacion_catedratico" })
export class AsignacionCatedratico {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "id_grado_ciclo" })
    idGradoCiclo: number;

    @Column({ name: "id_catedratico" })
    idCatedratico: number;

    @Column({ name: "id_curso" })
    idCurso: number;

    @Column({ name: "nota_maxima", type: "int" })
    notaMaxima: number;

    @Column({ name: "nota_aprobada", type: "int" })
    notaAprobada: number;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt?: Date;

    @ManyToOne(() => GradoCiclo)
    @JoinColumn({ name: "id_grado_ciclo" })
    gradoCiclo: GradoCiclo;

    @ManyToOne(() => Catedratico)
    @JoinColumn({ name: "id_catedratico" })
    catedratico: Catedratico;

    @ManyToOne(() => Curso)
    @JoinColumn({ name: "id_curso" })
    curso: Curso;
}
