import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Unique,
    ManyToOne,
    JoinColumn,
    BaseEntity
} from "typeorm";
import { TipoPago } from "./TipoPago";
import { AsignacionAlumno } from "./AsignacionAlumno";

@Entity({ name: "pagos" })
@Unique("UQ_asignacion_tipoPago_numeroPago", ["asignacionCursoId", "tipoPagoId", "numeroPago"])
export class Pago extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id", type: "int" })
    id: number;

    @Column({ name: "id_asignacion_curso", type: "int" })
    asignacionCursoId: number;

    @Column({ name: "id_tipo_pago", type: "int" })
    tipoPagoId: number;

    @Column({ name: "numero_pago", type: "int" })
    numeroPago: number;

    @Column({ name: "valor", type: "decimal", precision: 10, scale: 2 })
    valor: number;

    @Column({ name: "mora", type: "decimal", precision: 10, scale: 2 })
    mora: number;

    @Column({ name: "fecha_pago", type: "datetime" })
    fechaPago: Date;

    @CreateDateColumn({ name: "created_at", type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => AsignacionAlumno, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "id_asignacion_curso" })
    asignacionCurso: AsignacionAlumno;

    @ManyToOne(() => TipoPago, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "id_tipo_pago" })
    tipoPago: TipoPago;
}
