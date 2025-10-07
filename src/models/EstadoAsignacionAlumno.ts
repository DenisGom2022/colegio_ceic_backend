import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity({ name: "cat_estado_asignacion_alumno" })
export class EstadoAsignacionAlumno {
	@PrimaryColumn({ type: "int" })
	id: number;

	@Column({ type: "varchar", length: 100 })
	descripcion: string;

	@CreateDateColumn({ name: "created_at", type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at", type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
	updated_at: Date;

	@DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
	deleted_at?: Date;
}