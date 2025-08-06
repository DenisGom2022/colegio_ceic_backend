import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { GradoCiclo } from "./GradoCiclo";

@Entity({ name: "ciclo" })
export class Ciclo {
    @PrimaryColumn({ name: "id" })
    id: number;

    @Column({ name: "descripcion", type: "varchar", length: 255 })
    descripcion: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @Column({ name: "fecha_fin", type:"date" })
    fechaFin: Date|null;

    @OneToMany(() => GradoCiclo, gradoCiclo => gradoCiclo.ciclo)
    gradosCiclo: GradoCiclo[];

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt?: Date;
}