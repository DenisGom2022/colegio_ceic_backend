import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity({ name: "curso" })
export class Curso {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "nombre", type: "varchar", length: 255 })
    nombre: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt?: Date;
}
