import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTablePagos1762201992707 implements MigrationInterface {
    //numero_pago

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "pagos",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "id_asignacion_curso",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "id_tipo_pago",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "numero_pago",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "valor",
                        type: "decimal(10,2)",
                        isNullable: false
                    },
                    {
                        name: "mora",
                        type: "decimal(10,2)",
                        isNullable: false
                    },
                    {
                        name: "fecha_pago",
                        type: "datetime",
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
                uniques: [
                    {
                        name: "UQ_asignacion_tipoPago_numeroPago",
                        columnNames: ["id_asignacion_curso", "id_tipo_pago", "numero_pago"]
                    }
                ]
            })
        );

        await queryRunner.createForeignKey(
            "pagos",
            new TableForeignKey({
                columnNames: ["id_asignacion_curso"],
                referencedTableName: "asignacion_alumno",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
                name: "FK_pagos_asignacion"
            })
        );

        await queryRunner.createForeignKey(
            "pagos",
            new TableForeignKey({
                columnNames: ["id_tipo_pago"],
                referencedTableName: "cat_tipo_pago",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
                name: "FK_pagos_tiposPago"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar las foreign keys primero
        await queryRunner.dropForeignKey("pagos", "FK_pagos_asignacion");
        await queryRunner.dropForeignKey("pagos", "FK_pagos_tiposPago");
        // Eliminar la tabla pagos
        await queryRunner.dropTable("pagos");
    }

}
