import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity({ name: "cat_tipo_pago" })
export class TipoPago {
    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    id: number;

    @Column({ name: "descripcion", type: "varchar", length: 100 })
    descripcion: string;

    @CreateDateColumn({ name: "created_at", type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
    deletedAt?: Date;
}
