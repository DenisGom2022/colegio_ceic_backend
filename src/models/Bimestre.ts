import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	BaseEntity,
    OneToMany
} from "typeorm";
import { EstadoBimestre } from "./EstadoBimestre";
import { Curso } from "./Curso";
import { Tarea } from "./Tarea";

@Entity({ name: "bimestre" })
export class Bimestre extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: "numero_bimestre", type: "int" })
	numeroBimestre: number;

	@Column({ name: "id_estado", type: "int" })
	idEstado: number;

	@Column({ name: "fecha_inicio", type: "datetime" })
	fechaInicio: Date;

	@Column({ name: "fecha_fin", type: "datetime" })
	fechaFin: Date;

	@Column({ name: "id_curso", type: "int" })
	idCurso: number;

	@CreateDateColumn({ name: "created_at", type: "datetime" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at", type: "datetime" })
	updatedAt: Date;

	@DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
	deletedAt?: Date;

	@ManyToOne(() => EstadoBimestre, { onDelete: "CASCADE", onUpdate: "CASCADE" })
	@JoinColumn({ name: "id_estado" })
	estado: EstadoBimestre;

	@ManyToOne(() => Curso, { onDelete: "CASCADE", onUpdate: "CASCADE" })
	@JoinColumn({ name: "id_curso" })
	curso: Curso;

    @OneToMany(() => Tarea, tarea => tarea.curso)
    tareas:Tarea[];
}