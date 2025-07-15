import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Unique, OneToOne, JoinColumn, Index, BaseEntity } from "typeorm";
import { Usuario } from "./Usuario";

@Entity("catedratico")
export class Catedratico extends BaseEntity {
    @PrimaryColumn({ name:"dpi", type: "nvarchar" })
    dpi: string;

    @Column({ name:"id_usuario", type: "nvarchar", length: 50 })
    @Index("IDX_UNIQUE_ID_USUARIO", {unique: true})
    idUsuario: string;

    @OneToOne(() => Usuario, usuario => usuario.usuario, { eager: true })
    @JoinColumn({ name:"id_usuario" })
    usuario:Usuario;

    @CreateDateColumn({ name:"created_at", type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ name:"updated_at", type: "timestamp" })
    updatedAt: Date;

    @DeleteDateColumn({ name:"deleted_at", type: "timestamp", nullable: true })
    deletedAt?: Date | null;
}
