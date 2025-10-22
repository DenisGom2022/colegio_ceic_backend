import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import { Tarea } from "./Tarea";
import { AsignacionAlumno } from "./AsignacionAlumno";

@Entity({ name: "tarea_alumno" })
export class TareaAlumno extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "id_tarea" })
    idTarea: number;

    @Column({ name: "id_asignacion_alumno" })
    idAsignacionAlumno: number;

    @Column("decimal", { name: "punteo_obtenido", precision: 5, scale: 2, nullable: true })
    punteoObtenido?: number;

    @Column({ name: "fecha_entrega", type: "datetime", nullable: true })
    fechaEntrega?: Date;

    @Column({ name: "created_at", type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ name: "updated_at", type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @Column({ name: "deleted_at", type: "datetime", nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => Tarea, (tarea) => tarea.tareaAlumnos, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "id_tarea" })
    tarea: Tarea;

    @ManyToOne(() => AsignacionAlumno, (asignacionAlumno) => asignacionAlumno.tareaAlumnos, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "id_asignacion_alumno" })
    asignacionAlumno: AsignacionAlumno;
}
