import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTareaTable1757433915306 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "tarea",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "titulo",
                        type: "varchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "descripcion",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "punteo",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "fecha_entrega",
                        type: "datetime",
                        isNullable: false,
                    },
                    {
                        name: "id_bimestre",
                        type: "int",
                        isNullable: false,
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
                ],
            })

        );

        await queryRunner.createForeignKey(
            "tarea",
            new TableForeignKey({
                columnNames: ["id_bimestre"],
                referencedTableName: "bimestre",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
                name:"FK_tarea_bimestre"
            })
        );

        await queryRunner.createForeignKey(
            "tarea",
            new TableForeignKey({
                columnNames: ["id_curso"],
                referencedTableName: "curso",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
                name:"FK_tarea_curso"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("tarea");
        if (table) {
            const foreignKeyBimestre = table.foreignKeys.find(
                fk => fk.columnNames.indexOf("id_bimestre") !== -1
            );
            if (foreignKeyBimestre) {
                await queryRunner.dropForeignKey("tarea", foreignKeyBimestre);
            }

            const foreignKeyCurso = table.foreignKeys.find(
                fk => fk.columnNames.indexOf("id_curso") !== -1
            );
            if (foreignKeyCurso) {
                await queryRunner.dropForeignKey("tarea", foreignKeyCurso);
            }
        }

        await queryRunner.dropTable("tarea");
    }

}
