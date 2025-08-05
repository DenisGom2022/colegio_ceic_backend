import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity({ name: "ciclo" })
export class Ciclo {
    @PrimaryColumn({ name: "id" })
    id: number;

    @Column({ name: "descripcion", type: "varchar", length: 255 })
    descripcion: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @Column({ name: "fecha_fin", type:"date" })
    fechaFin:Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt?: Date;
}
