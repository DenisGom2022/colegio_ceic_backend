import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCursoTable1752707483237 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.createTable(
                new Table({
                    name: "curso",
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
        }
    
        public async down(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.dropTable("curso");
        }

}
