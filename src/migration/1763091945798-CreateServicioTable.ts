import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateServicioTable1763091945798 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
                    new Table({
                        name: "servicios",
                        columns: [
                            {
                                name: "id",
                                type: "int",
                                isPrimary: true,
                                isGenerated: true,
                                generationStrategy: "increment"
                            },
                            {
                                name: "descripcion",
                                type: "nvarchar",
                                length: "100",
                                isNullable: false
                            },
                            {
                                name: "valor",
                                type: "decimal(10,2)",
                                isNullable: false
                            },
                            {
                                name: "fecha_a_pagar",
                                type: "datetime",
                                isNullable: false
                            },
                            {
                                name: "id_grado_ciclo",
                                type: "int",
                                isNullable: false
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
                    "servicios",
                    new TableForeignKey({
                        columnNames: ["id_grado_ciclo"],
                        referencedTableName: "grado_ciclo",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                        name: "FK_servicios_grado_ciclo"
                    })
                );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("servicios", "FK_servicios_grado_ciclo");
        await queryRunner.dropTable("servicios");
    }

}
