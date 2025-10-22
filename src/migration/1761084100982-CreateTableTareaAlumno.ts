import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableTareaAlumno1761084100982 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "tarea_alumno",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "id_tarea",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "id_asignacion_alumno",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "punteo_obtenido",
                        type: "decimal(5,2)",
                        isNullable: true
                    },
                    {
                        name: "fecha_entrega",
                        type: "datetime",
                        isNullable: true
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
                uniques: [
                    {
                        name: "UQ_tareaAlumno_idTarea_idAsignacionAlumno",
                        columnNames: ["id_tarea", "id_asignacion_alumno"]
                    }
                ]
            })
        );

        await queryRunner.createForeignKey(
            "tarea_alumno",
            new TableForeignKey({
                columnNames: ["id_tarea"],
                referencedTableName: "tarea",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
                name: "FK_tareaAlumno_tarea"
            })
        );

        await queryRunner.createForeignKey(
            "tarea_alumno",
            new TableForeignKey({
                columnNames: ["id_asignacion_alumno"],
                referencedTableName: "asignacion_alumno",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
                name: "FK_tareaAlumno_asignacionAlumno"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar el índice único antes de eliminar la tabla
        await queryRunner.dropUniqueConstraint("tarea_alumno", "UQ_tareaAlumno_idTarea_idAsignacionAlumno");
        // Eliminar las foreign keys antes de eliminar la tabla
        await queryRunner.dropForeignKey("tarea_alumno", "FK_tareaAlumno_tarea");
        await queryRunner.dropForeignKey("tarea_alumno", "FK_tareaAlumno_asignacionAlumno");
        // Eliminar la tabla
        await queryRunner.dropTable("tarea_alumno");
    }

}
