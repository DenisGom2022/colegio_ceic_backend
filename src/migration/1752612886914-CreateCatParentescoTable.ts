import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCatParentescoTable1752612886914 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.createTable(
                new Table({
                    name: "cat_parentesco",
                    columns: [
                        {
                            name: "id",
                            type: "int",
                            isPrimary: true,
                        },
                        {
                            name: "descripcion",
                            type: "nvarchar",
                            length: "50",
                            isNullable: false
                        },
                        {
                            name:"created_at",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                            isNullable: false
                        },
                        {
                            name:"updated_at",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                            isNullable: false
                        },
                        {
                            name:"deleted_at",
                            type: "timestamp",
                            isNullable: true
                        }
                    ]
                })
            )
        }
    
        public async down(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.dropTable("cat_parentesco");
        }

}
