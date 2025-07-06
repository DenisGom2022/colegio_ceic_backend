import { MigrationInterface, QueryRunner } from "typeorm";

export class DatosInicialesTipoUsuarioTable1751776304211 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO cat_tipo_usuario (id, descripcion) VALUES
            (1, 'Administrador'),
            (2, 'Docente')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM cat_tipo_usuario WHERE id IN (1, 2)
        `);
    }

}
