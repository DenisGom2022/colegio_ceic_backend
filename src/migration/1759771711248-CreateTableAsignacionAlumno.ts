import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableAsignacionAlumno1759771711248 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "asignacion_alumno",
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
                        isNullable: false
                    },
                    {
                        name: "id_alumno",
                        type: "nvarchar",
                        isNullable: false,
                        length: "20"
                    },
                    {
                        name: "id_estado_asignacion",
                        type: "int",
                        isNullable: false
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
            "asignacion_alumno",
            new TableForeignKey({
                columnNames: ["id_grado_ciclo"],
                referencedTableName: "grado_ciclo",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
                name: "FK_asignacion_gradoCiclo"
            })
        );

        await queryRunner.createForeignKey(
            "asignacion_alumno",
            new TableForeignKey({
                columnNames: ["id_alumno"],
                referencedTableName: "alumno",
                referencedColumnNames: ["cui"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
                name: "FK_asignacion_alumno"
            })
        );

        await queryRunner.createForeignKey(
            "asignacion_alumno",
            new TableForeignKey({
                columnNames: ["id_estado_asignacion"],
                referencedTableName: "cat_estado_asignacion_alumno",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
                name: "FK_asignacion_estado"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar las foreign keys en orden inverso
        await queryRunner.dropForeignKey("asignacion_alumno", "FK_asignacion_estado");
        await queryRunner.dropForeignKey("asignacion_alumno", "FK_asignacion_alumno");
        await queryRunner.dropForeignKey("asignacion_alumno", "FK_asignacion_gradoCiclo");
        // Eliminar la tabla
        await queryRunner.dropTable("asignacion_alumno");
    }

}
