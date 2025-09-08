import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateBimestreTable1757113676727 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "bimestre",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "numero_bimestre",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "id_estado",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "fecha_inicio",
                        type: "datetime",
                        isNullable: false
                    },
                    {
                        name: "fecha_fin",
                        type: "datetime",
                        isNullable: false
                    },
                    {
                        name: "id_curso",
                        type: "int",
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
                ]
            }))

        await queryRunner.createForeignKey(
            "bimestre",
            new TableForeignKey({
                columnNames: ["id_estado"],
                referencedTableName: "cat_estado_bimestre",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            })
        )

        await queryRunner.createForeignKey(
            "bimestre",
            new TableForeignKey({
                columnNames: ["id_curso"],
                referencedTableName: "curso",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("bimestre");
        if (table) {
            const foreignKeyEstado = table.foreignKeys.find(fk => fk.columnNames.indexOf("id_estado") !== -1);
            if (foreignKeyEstado) {
                await queryRunner.dropForeignKey("bimestre", foreignKeyEstado);
            }
            const foreignKeyCurso = table.foreignKeys.find(fk => fk.columnNames.indexOf("id_curso") !== -1);
            if (foreignKeyCurso) {
                await queryRunner.dropForeignKey("bimestre", foreignKeyCurso);
            }
        }
        await queryRunner.dropTable("bimestre");
    }

}
