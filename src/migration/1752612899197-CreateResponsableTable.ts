import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateResponsableTable1752612899197 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "responsable",
                columns: [
                    {
                        name: "id_responsable",
                        type: "nvarchar",
                        isPrimary: true
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
                        name: "id_parentesco",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "cui_alumno",
                        type: "nvarchar",
                        length: "20",
                        isNullable: false                        
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["cui_alumno"],
                        referencedColumnNames: ["cui"],
                        referencedTableName: "alumno",
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                        name: "FK_cui_alumno_responsable"
                    },
                    {
                        columnNames: ["id_parentesco"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "cat_parentesco",
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                        name: "FK_id_parentesco_responsable"
                    }
                ]
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("responsable");
    }

}