import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, BaseEntity } from "typeorm";
import { GradoCiclo } from "./GradoCiclo";
import { Catedratico } from "./Catedratico";
import { Tarea } from "./Tarea";

@Entity({ name: "curso" })
export class Curso extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "nombre", type: "varchar", length: 255 })
    nombre: string;

    @Column({ name: "nota_maxima", type: "int" })
    notaMaxima: number;

    @Column({ name: "nota_aprobada", type: "int" })
    notaAprobada: number;

    @Column({ name: "id_grado_ciclo", type: "int" })
    idGradoCiclo: number;

    @Column({ name: "dpi_catedratico", type: "int" })
    dpiCatedratico: number;

    @ManyToOne(() => GradoCiclo)
    @JoinColumn({ name: "id_grado_ciclo" })
    gradoCiclo: GradoCiclo;

    @ManyToOne(() => Catedratico)
    @JoinColumn({ name: "dpi_catedratico" })
    catedratico: Catedratico;

    @OneToMany(() => Tarea, tarea => tarea.curso)
    tareas:Tarea[];

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt?: Date;
}
