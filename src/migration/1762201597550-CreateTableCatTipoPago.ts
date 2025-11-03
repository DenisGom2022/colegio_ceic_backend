import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableCatTipoPago1762201597550 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "cat_tipo_pago",
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
            INSERT INTO cat_tipo_pago (id, descripcion) VALUES
            (1, 'Inscripción'),
            (2, 'Mensualidad')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("cat_tipo_pago");
    }

}
