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
                        name: "primerNombre",
                        type: "nvarchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "segundoNombre",
                        type: "nvarchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "tercerNombre",
                        type: "nvarchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "primerApellido",
                        type: "nvarchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "segundoApellido",
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
                        enumName: "genero_enum", // opcional, pero útil para claridad
                        isNullable: false
                    }

                ]
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("alumno");
    }

}
