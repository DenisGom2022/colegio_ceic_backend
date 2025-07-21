import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateGradoCicloTable1752771396142 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "grado_ciclo",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "id_grado",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "id_ciclo",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "precio_pago",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: "cantidad_pagos",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "precio_inscripcion",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "deleted_at",
                        type: "datetime",
                        isNullable: true,
                    },
                ],
            })
        );
        await queryRunner.createForeignKey(
            "grado_ciclo",
            new TableForeignKey({
                columnNames: ["id_grado"],
                referencedTableName: "grado",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                name: "FK_gradoCiclo_grado"
            })
        );
        await queryRunner.createForeignKey(
            "grado_ciclo",
            new TableForeignKey({
                columnNames: ["id_ciclo"],
                referencedTableName: "ciclo",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                name: "FK_gradoCiclo_ciclo"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("grado_ciclo");
    }

}
