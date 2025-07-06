import { BaseEntity, Column, Entity, OneToMany } from "typeorm";
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

    @Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP", nullable: false })
    createdAt: Date;

    @Column({ name: "updated_at", type: "timestamp", nullable: false })
    updatedAt: Date;

    @OneToMany(() => TipoUsuario, tipoUsuario => tipoUsuario.id, { eager: true })
    tipoUsuario: TipoUsuario;

    constructor(
        usuario: string,
        contrasena: string,
        primerNombre: string,
        segundoNombre: string,
        tercerNombre: string,
        primerApellido: string,
        segundoApellido: string,
        idTipoUsuario: number,
        telefono: string
    ) {
        super();
        this.usuario = usuario;
        this.contrasena = contrasena;
        this.primerNombre = primerNombre;
        this.segundoNombre = segundoNombre;
        this.tercerNombre = tercerNombre;
        this.primerApellido = primerApellido;
        this.segundoApellido = segundoApellido;
        this.idTipoUsuario = idTipoUsuario;
        this.telefono = telefono;
    }

}