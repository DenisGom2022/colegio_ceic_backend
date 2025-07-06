import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { TipoUsuario } from "./TipoUsuario";

@Entity("usuario")
export class Usuario extends BaseEntity {
    @Column({ name: "usuario", primary: true, type: "nvarchar", length: 50 })
    usuario: string;

    @Column({ name: "contrasena", type: "nvarchar", length: 255 })
    contrasena: string;

    @Column({ name: "primer_nombre", type: "nvarchar", length: 50, nullable: false })
    primerNombre: string;

    @Column({ name: "segundo_nombre", type: "nvarchar", length: 50, nullable: true })
    segundoNombre: string;

    @Column({ name: "tercer_nombre", type: "nvarchar", length: 50, nullable: true })
    tercerNombre: string;

    @Column({ name: "primer_apellido", type: "nvarchar", length: 50, nullable: false })
    primerApellido: string;

    @Column({ name: "segundo_apellido", type: "nvarchar", length: 50, nullable: true })
    segundoApellido: string;

    @Column({ name: "id_tipo_usuario", type: "int", nullable: false })
    idTipoUsuario: number;

    @Column({ name: "telefono", type: "nvarchar", length: 20, nullable: true })
    telefono: string;

    @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
    deletedAt: Date;

    @ManyToOne(() => TipoUsuario, tipoUsuario => tipoUsuario.id, { eager: true })
    @JoinColumn({ name: "id_tipo_usuario" }) 
    tipoUsuario: TipoUsuario;

}