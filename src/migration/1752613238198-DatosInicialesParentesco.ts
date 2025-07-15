import { MigrationInterface, QueryRunner } from "typeorm";

export class DatosInicialesParentesco1752613238198 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO cat_parentesco (id, descripcion) VALUES
            (1, 'Padre'),
            (2, 'Madre'),
            (3, 'Tio'),
            (4, 'Hermano'),
            (5, 'Responsable')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM cat_parentesco WHERE id IN (1, 2, 3, 4, 5)
        `);
    }

}
