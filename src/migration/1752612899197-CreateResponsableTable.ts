import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateResponsableTable1752612899197 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "responsable",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "id_responsable",
                        type: "nvarchar"
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
                        name: "id_parentesco",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "cui_alumno",
                        type: "nvarchar",
                        length: "20",
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