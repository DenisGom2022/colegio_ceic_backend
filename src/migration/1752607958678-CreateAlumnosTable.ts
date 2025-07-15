import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAlumnosTable1752607958678 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "alumno",
                columns: [
                    {
                        name: "cui",
                        type: "nvarchar",
                        isPrimary: true,
                        length: "20",
                    },
                    {
                        name: "primer_nombre",
                        type: "nvarchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "segundo_nombre",
                        type: "nvarchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "tercer_nombre",
                        type: "nvarchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "primer_apellido",
                        type: "nvarchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "segundo_apellido",
                        type: "nvarchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "telefono",
                        type: "nvarchar",
                        length: "20",
                        isNullable: true
                    },
                    {
                        name: "genero",
                        type: "enum",
                        enum: ["M", "F"],
                        enumName: "genero_enum",
                        isNullable: false
                    },
                    {
                        name: "created_at",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false
                    },
                    {
                        name: "updated_at",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                        isNullable: false
                    },
                    {
                        name: "deleted_at",
                        type: "datetime",
                        isNullable: true
                    }
                ]
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("alumno");
    }

}
