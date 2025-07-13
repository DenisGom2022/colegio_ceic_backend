import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsuarioTable1751775948111 implements MigrationInterface {

        public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "usuario",
                columns: [
                    {
                        name: "usuario",
                        type: "nvarchar",
                        isPrimary: true,
                        length: "50"
                    },
                    {
                        name: "contrasena",
                        type: "nvarchar",
                        length: "255"
                    },
                    {
                      name:"primer_nombre",
                      type: "nvarchar",
                      length: "50",
                      isNullable: false  
                    },
                    {
                      name:"segundo_nombre",
                      type: "nvarchar",
                      length: "50",
                      isNullable: true  
                    },
                    {
                        name:"tercer_nombre",
                        type: "nvarchar",
                        length: "50",
                        isNullable: true
                    },
                    {
                      name:"primer_apellido",
                      type: "nvarchar",
                      length: "50",
                      isNullable: false  
                    },
                    {
                      name:"segundo_apellido",
                      type: "nvarchar",
                      length: "50",
                      isNullable: true  
                    },
                    {
                        name:"id_tipo_usuario",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name:"telefono",
                        type:"nvarchar",
                        length: "20",
                        isNullable: true
                    },
                    {
                        name:"cambar_contrasena",
                        type: "smallint",
                        isNullable: true,
                        default: 0
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
                ],
                foreignKeys: [
                    {
                        columnNames: ["id_tipo_usuario"],
                        referencedTableName: "cat_tipo_usuario",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE"
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("usuario");
    }

}
