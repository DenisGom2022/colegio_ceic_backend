import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateJornadaTable1752764392338 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.createTable(
                new Table({
                    name: "cat_jornada",
                    columns: [
                        {
                            name: "id",
                            type: "int",
                            isPrimary: true,
                            isGenerated: true,
                            generationStrategy: "increment",
                        },
                        {
                            name: "descripcion",
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
            await queryRunner.dropTable("cat_jornada");
        }

}
