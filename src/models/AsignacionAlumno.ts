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
import { GradoCiclo } from "./GradoCiclo";
import { Alumno } from "./Alumno";
import { EstadoAsignacionAlumno } from "./EstadoAsignacionAlumno";
import { TareaAlumno } from "./TareaAlumno";

@Entity({ name: "asignacion_alumno" })
export class AsignacionAlumno extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: "id_grado_ciclo", type: "int" })
	idGradoCiclo: number;

	@OneToMany(() => TareaAlumno, (tareaAlumno) => tareaAlumno.asignacionAlumno)
	tareaAlumnos: TareaAlumno[];
	@Column({ name: "id_alumno", type: "nvarchar", length: 20 })
	idAlumno: string;

	@Column({ name: "id_estado_asignacion", type: "int" })
	idEstadoAsignacion: number;

	@CreateDateColumn({ name: "created_at", type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at", type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
	updatedAt: Date;

	@DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
	deletedAt?: Date;

	@ManyToOne(() => GradoCiclo, (gradoCiclo) => gradoCiclo.asignacionesAlumno, { onDelete: "CASCADE", onUpdate: "CASCADE" })
	@JoinColumn({ name: "id_grado_ciclo" })
	gradoCiclo: GradoCiclo;

	@ManyToOne(() => Alumno, (alumno) => alumno.asignaciones, { onDelete: "CASCADE", onUpdate: "CASCADE" })
	@JoinColumn({ name: "id_alumno" })
	alumno: Alumno;

	@ManyToOne(() => EstadoAsignacionAlumno, (estado) => estado.id, { onDelete: "CASCADE", onUpdate: "CASCADE" })
	@JoinColumn({ name: "id_estado_asignacion" })
	estadoAsignacion: EstadoAsignacionAlumno;
}
