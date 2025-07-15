import { BaseEntity, Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class Catedratico extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "persona_id", type: "int" })
    personaId: number;

    @Column({ name: "id_usuario", type: "nvarchar", length: "50" })
    idUsuario: string;

    @ManyToOne(() => Usuario, usuario => usuario.catedraticos)
    usuario: Usuario;

    @ManyToOne(() => Persona, persona => persona.catedraticos)
    persona: Persona;

    @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;
}