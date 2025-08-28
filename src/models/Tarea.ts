import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Curso } from "./Curso";

@Entity({ name: "tarea" })
export class Tarea extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: "descripcion", type: "varchar", length: 100 })
	descripcion: string;

	@Column({ name: "nota" ,type: "int" })
	nota: number;

	@Column({ name:"fecha_entrega",  type: "datetime" })
	fechaEntrega: Date;

	@Column({ name:"id_curso", type: "int" })
	idCurso: number;

	@ManyToOne(() => Curso, curso => curso.tareas, { onDelete: "CASCADE", onUpdate: "CASCADE" })
	@JoinColumn({ name: "id_curso" })
	curso: Curso;

	@CreateDateColumn({name: "created_at"})
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at",  type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
	updatedAt: Date;

	@DeleteDateColumn({ name:"deleted_at", type: "datetime", nullable: true })
	deletedAt?: Date;
}
