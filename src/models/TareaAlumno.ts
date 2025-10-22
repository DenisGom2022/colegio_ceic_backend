import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Tarea } from "./Tarea";
import { AsignacionAlumno } from "./AsignacionAlumno";

@Entity({ name: "tarea_alumno" })
export class TareaAlumno {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_tarea: number;

    @Column()
    id_asignacion_alumno: number;

    @Column("decimal", { precision: 5, scale: 2, nullable: true })
    punteo_obtenido?: number;

    @Column({ type: "datetime", nullable: true })
    fecha_entrega?: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date;

    @Column({ type: "datetime", nullable: true })
    deleted_at?: Date;

    @ManyToOne(() => Tarea, (tarea) => tarea.tareaAlumnos, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "id_tarea" })
    tarea: Tarea;

    @ManyToOne(() => AsignacionAlumno, (asignacionAlumno) => asignacionAlumno.tareaAlumnos, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "id_asignacion_alumno" })
    asignacionAlumno: AsignacionAlumno;
}
