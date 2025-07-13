import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcryptjs";

export class DatosIncialesUsuario1752447917556 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const usuarios = {
            usuario: "admin",
            contrasena: "admin123", // La contraseña debe ser encriptada antes de guardarla
            primerNombre: "Admin",
            segundoNombre: "System",
            tercerNombre: "",
            primerApellido: "Administrator",
            segundoApellido: "",
            telefono: "1234567890",
            idTipoUsuario: 1 // Asumiendo que 1 es el ID del tipo de usuario 'Administrador'
        }
        // Encriptar la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(usuarios.contrasena, 10);
        await queryRunner.query(`
            INSERT INTO usuario (usuario, contrasena, primer_nombre, segundo_nombre, tercer_nombre, primer_apellido, segundo_apellido, telefono, id_tipo_usuario)
            VALUES ('${usuarios.usuario}', '${hashedPassword}', '${usuarios.primerNombre}', '${usuarios.segundoNombre}', '${usuarios.tercerNombre}', '${usuarios.primerApellido}', '${usuarios.segundoApellido}', '${usuarios.telefono}', ${usuarios.idTipoUsuario})
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM usuario WHERE usuario = 'admin'
        `);
    }

}
