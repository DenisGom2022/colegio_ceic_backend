import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity({ name: "cat_parentesco" })
export class TipoParentesco extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "nvarchar", length: 50 })
    descripcion: string;

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
    deletedAt?: Date;
}