import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateNivelAcademicoTable1752763300998 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.createTable(
                new Table({
                    name: "cat_nivel_academico",
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
                    ],
                })
            );
        }
    
        public async down(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.dropTable("cat_nivel_academico");
        }

}
