import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableEstadoAsignacionAlumno1759764085209 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "cat_estado_asignacion_alumno",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                    },
                    {
                        name: "descripcion",
                        type: "varchar",
                        length: "100",
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
                ]
            })
        );

        // Insertar datos iniciales
        await queryRunner.query(`
            INSERT INTO cat_estado_asignacion_alumno (id, descripcion) VALUES
            (1, 'Activo'),
            (2, 'Inactivo')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("cat_estado_asignacion_alumno");
    }
}
