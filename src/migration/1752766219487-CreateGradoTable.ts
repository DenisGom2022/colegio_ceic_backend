import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateGradoTable1752766219487 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.createTable(
                new Table({
                    name: "grado",
                    columns: [
                        {
                            name: "id",
                            type: "int",
                            isPrimary: true,
                            isGenerated: true,
                            generationStrategy: "increment",
                        },
                        {
                            name: "nombre",
                            type: "varchar",
                            length: "255",
                            isNullable: false,
                        },
                        {
                            name: "id_nivel",
                            type: "int",
                            isNullable: false,
                        },
                        {
                            name: "id_jornada",
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
                "grado",
                new TableForeignKey({
                    columnNames: ["id_nivel"],
                    referencedTableName: "cat_nivel_academico",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                    name: "FK_alumno_nivel"
                })
            );
            await queryRunner.createForeignKey(
                "grado",
                new TableForeignKey({
                    columnNames: ["id_jornada"],
                    referencedTableName: "cat_jornada",
                    referencedColumnNames: ["id"],
                    onDelete: "CASCADE",
                    name: "FK_alumno_jornada"
                })
            );
        }
    
        public async down(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.dropTable("grado");
        }

}
