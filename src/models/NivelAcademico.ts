import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity({ name: "cat_nivel_academico" })
export class NivelAcademico {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "descripcion", type: "varchar", length: 255 })
    descripcion: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt?: Date;
}
