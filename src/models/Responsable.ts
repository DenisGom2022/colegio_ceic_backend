import { BaseEntity, Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { Alumno } from "./Alumno";
import { TipoParentesco } from "./TipoParentesco";

@Entity({ name: "responsable" })
export class Responsable extends BaseEntity {

    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column({ name: "id_responsable", type: "nvarchar" })
    idResponsable: string;

    @Column({ name: "primer_nombre", type: "nvarchar", length: 100 })
    primerNombre: string;

    @Column({ name: "segundo_nombre", type: "nvarchar", length: 100, nullable: true })
    segundoNombre?: string;

    @Column({ name: "tercer_nombre", type: "nvarchar", length: 100, nullable: true })
    tercerNombre?: string;

    @Column({ name: "primer_apellido", type: "nvarchar", length: 100 })
    primerApellido: string;

    @Column({ name: "segundo_apellido", type: "nvarchar", length: 100, nullable: true })
    segundoApellido?: string;

    @Column({ name: "telefono", type: "nvarchar", length: 20, nullable: true })
    telefono?: string;

    @Column({ name: "id_parentesco", type: "int" })
    idParentesco: number;

    @Column({ name: "cui_alumno", type: "nvarchar", length: 20 })
    cuiAlumno: string;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "datetime" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => Alumno, alumno => alumno.responsables, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "cui_alumno", referencedColumnName: "cui" })
    alumno: Alumno;

    @ManyToOne(() => TipoParentesco, parentesco => parentesco.id, { onDelete: "CASCADE", onUpdate: "CASCADE", eager:true })
    @JoinColumn({ name: "id_parentesco", referencedColumnName: "id" })
    parentesco: TipoParentesco;

    public isEqual(r:Responsable):boolean{
        if(!r){
            return false;
        }
        if(this.idResponsable != r.idResponsable){
            return false;
        }
        if(this.primerNombre != r.primerNombre){
            return false;
        }
        if(this.segundoNombre != r.segundoNombre){
            return false;
        }
        if(this.tercerNombre != r.tercerNombre){
            return false;
        }
        if(this.primerApellido != r.primerApellido){
            return false;
        }
        if(this.segundoApellido != r.segundoApellido){
            return false;
        }
        if(this.telefono != r.telefono){
            return false;
        }

        return this.idParentesco == r.idParentesco;        
    }

    public modificaCampos(r: Responsable): Responsable {
        this.idResponsable = r.idResponsable;
        this.primerNombre = r.primerNombre;
        this.segundoNombre = r.segundoNombre;
        this.tercerNombre = r.tercerNombre;
        this.primerApellido = r.primerApellido;
        this.segundoApellido = r.segundoApellido;
        this.telefono = r.telefono;
        this.idParentesco = r.idParentesco;
        if (this.parentesco) {
            this.parentesco.id = r.idParentesco;
        }
        return this;
    }
}