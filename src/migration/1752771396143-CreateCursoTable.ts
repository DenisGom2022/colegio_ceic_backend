import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

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
                        name: "nota_maxima",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "nota_aprobada",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "id_grado_ciclo",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "dpi_catedratico",
                        type: "nvarchar",
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

        await queryRunner.createForeignKey("curso", new TableForeignKey({
            columnNames: ["id_grado_ciclo"],
            referencedTableName: "grado_ciclo",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            name: "FK_curso_gradoCiclo"
        }));

        await queryRunner.createForeignKey("curso", new TableForeignKey({
            columnNames: ["dpi_catedratico"],
            referencedTableName: "catedratico",
            referencedColumnNames: ["dpi"],
            onDelete: "CASCADE",
            name: "FK_curso_catedratico"
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("curso");
    }

}
