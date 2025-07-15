import { MigrationInterface, QueryRunner, Table, TableIndex, TableUnique } from "typeorm";

export class CreateCatedraticoTable1752591175732 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "catedratico",
                columns: [
                    {
                        name: "dpi",
                        type: "nvarchar",
                        isPrimary: true
                    },
                    {
                        name: "id_usuario",
                        type: "nvarchar",
                        length: "50",
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["id_usuario"],
                        referencedTableName: "usuario",
                        referencedColumnNames: ["usuario"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE"
                    }
                ]
            })
        );



        await queryRunner.createIndex("catedratico", new TableIndex({
            name: "IDX_UNIQUE_ID_USUARIO",
            columnNames: ["id_usuario"],
            isUnique: true
        }));


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("catedratico");
    }

}
