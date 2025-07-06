import { BaseEntity, Collection, Column, Entity } from "typeorm";

@Entity("cat_tipo_usuario")
export class TipoUsuario extends BaseEntity {
    @Column({name: "id",  primary: true, type: "int" })
    id: number;

    @Column({name: "descripcion", type: "varchar", length: 100 })
    descripcion: string;

    @Column({name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
    
    constructor(id: number, descripcion: string) {
        super();
        this.id = id;
        this.descripcion = descripcion;
    }
}