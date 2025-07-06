import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTipoUsuarioTable1751775060175 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "cat_tipo_usuario",
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
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("cat_tipo_usuario");
    }

}
