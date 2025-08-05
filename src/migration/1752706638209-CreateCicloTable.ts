import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCicloTable1752706638209 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.createTable(
                new Table({
                    name: "ciclo",
                    columns: [
                        {
                            name: "id",
                            type: "int",
                            isPrimary: true,
                            isNullable: false,
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
                            name: "fecha_fin",
                            type: "datetime",
                            isNullable: true
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
            await queryRunner.dropTable("ciclo");
        }

}
