import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateAsignacionCatedraticoTable1752774210923 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "asignacion_catedratico",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "id_grado_ciclo",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "id_catedratico",
                        type: "nvarchar",
                        isNullable: false,
                    },
                    {
                        name: "id_curso",
                        type: "int",
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
            "asignacion_catedratico",
            new TableForeignKey({
                columnNames: ["id_grado_ciclo"],
                referencedTableName: "grado_ciclo",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                name: "FK_asignacionCatedratico_gradoCiclo"
            })
        );
        await queryRunner.createForeignKey(
            "asignacion_catedratico",
            new TableForeignKey({
                columnNames: ["id_catedratico"],
                referencedTableName: "catedratico",
                referencedColumnNames: ["dpi"],
                onDelete: "CASCADE",
                name: "FK_asignacionCatedratico_catedratico"
            })
        );
        await queryRunner.createForeignKey(
            "asignacion_catedratico",
            new TableForeignKey({
                columnNames: ["id_curso"],
                referencedTableName: "curso",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                name: "FK_asignacionCatedratico_curso"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("asignacion_catedratico");
    }

}
