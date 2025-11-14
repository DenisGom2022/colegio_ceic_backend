import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { GradoCiclo } from './GradoCiclo';

@Entity('servicios')
export class Servicio extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'nvarchar', length: 100 })
    descripcion: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    valor: number;

    @Column({ type: 'datetime' })
    fecha_a_pagar: Date;

    @Column()
    id_grado_ciclo: number;

    @ManyToOne(() => GradoCiclo, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'id_grado_ciclo' })
    gradoCiclo: GradoCiclo;

    @CreateDateColumn({ type: 'datetime' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'datetime', nullable: true })
    deleted_at: Date;
}