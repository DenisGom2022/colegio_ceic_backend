import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({name:"cat_estado_bimestre"})
export class EstadoBimestre extends BaseEntity {
    @PrimaryColumn({name:"id", type:"int"})
    id:number;

    @Column({name:"descripcion", type:"varchar"})
    descripcion:string;

    @CreateDateColumn({name: "created_at", type:"datetime"})
    createdAt:Date;

    @UpdateDateColumn({name:"updated_at", type: "datetime"})
    updatedAt:Date;

    @DeleteDateColumn({name:"deleted_at", type: "datetime"})
    deletedAt:Date;
}