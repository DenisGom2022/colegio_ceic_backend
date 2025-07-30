SELECT
    `Catedratico`.`dpi` AS `Catedratico_dpi`,
    `Catedratico`.`id_usuario` AS `Catedratico_id_usuario`,
    `Catedratico`.`created_at` AS `Catedratico_created_at`,
    `Catedratico`.`updated_at` AS `Catedratico_updated_at`,
    `Catedratico`.`deleted_at` AS `Catedratico_deleted_at`,
    `Catedratico__Catedratico_usuario`.`usuario` AS `Catedratico__Catedratico_usuario_usuario`,
    `Catedratico__Catedratico_usuario`.`contrasena` AS `Catedratico__Catedratico_usuario_contrasena`,
    `Catedratico__Catedratico_usuario`.`primer_nombre` AS `Catedratico__Catedratico_usuario_primer_nombre`,
    `Catedratico__Catedratico_usuario`.`segundo_nombre` AS `Catedratico__Catedratico_usuario_segundo_nombre`,
    `Catedratico__Catedratico_usuario`.`tercer_nombre` AS `Catedratico__Catedratico_usuario_tercer_nombre`,
    `Catedratico__Catedratico_usuario`.`primer_apellido` AS `Catedratico__Catedratico_usuario_primer_apellido`,
    `Catedratico__Catedratico_usuario`.`segundo_apellido` AS `Catedratico__Catedratico_usuario_segundo_apellido`,
    `Catedratico__Catedratico_usuario`.`id_tipo_usuario` AS `Catedratico__Catedratico_usuario_id_tipo_usuario`,
    `Catedratico__Catedratico_usuario`.`telefono` AS `Catedratico__Catedratico_usuario_telefono`,
    `Catedratico__Catedratico_usuario`.`cambar_contrasena` AS `Catedratico__Catedratico_usuario_cambar_contrasena`,
    `Catedratico__Catedratico_usuario`.`created_at` AS `Catedratico__Catedratico_usuario_created_at`,
    `Catedratico__Catedratico_usuario`.`updated_at` AS `Catedratico__Catedratico_usuario_updated_at`,
    `Catedratico__Catedratico_usuario`.`deleted_at` AS `Catedratico__Catedratico_usuario_deleted_at`,
    `32f98bb58df14e9d38a158ceb166856e0be3de21`.`id` AS `32f98bb58df14e9d38a158ceb166856e0be3de21_id`,
    `32f98bb58df14e9d38a158ceb166856e0be3de21`.`descripcion` AS `32f98bb58df14e9d38a158ceb166856e0be3de21_descripcion`,
    `32f98bb58df14e9d38a158ceb166856e0be3de21`.`created_at` AS `32f98bb58df14e9d38a158ceb166856e0be3de21_created_at`,
    `Catedratico__usuario`.`usuario` AS `Catedratico__usuario_usuario`,
    `Catedratico__usuario`.`contrasena` AS `Catedratico__usuario_contrasena`,
    `Catedratico__usuario`.`primer_nombre` AS `Catedratico__usuario_primer_nombre`,
    `Catedratico__usuario`.`segundo_nombre` AS `Catedratico__usuario_segundo_nombre`,
    `Catedratico__usuario`.`tercer_nombre` AS `Catedratico__usuario_tercer_nombre`,
    `Catedratico__usuario`.`primer_apellido` AS `Catedratico__usuario_primer_apellido`,
    `Catedratico__usuario`.`segundo_apellido` AS `Catedratico__usuario_segundo_apellido`,
    `Catedratico__usuario`.`id_tipo_usuario` AS `Catedratico__usuario_id_tipo_usuario`,
    `Catedratico__usuario`.`telefono` AS `Catedratico__usuario_telefono`,
    `Catedratico__usuario`.`cambar_contrasena` AS `Catedratico__usuario_cambar_contrasena`,
    `Catedratico__usuario`.`created_at` AS `Catedratico__usuario_created_at`,
    `Catedratico__usuario`.`updated_at` AS `Catedratico__usuario_updated_at`,
    `Catedratico__usuario`.`deleted_at` AS `Catedratico__usuario_deleted_at`,
    `Catedratico__usuario__tipoUsuario`.`id` AS `Catedratico__usuario__tipoUsuario_id`,
    `Catedratico__usuario__tipoUsuario`.`descripcion` AS `Catedratico__usuario__tipoUsuario_descripcion`,
    `Catedratico__usuario__tipoUsuario`.`created_at` AS `Catedratico__usuario__tipoUsuario_created_at`
FROM
    `catedratico` `Catedratico`
    LEFT JOIN `usuario` `Catedratico__Catedratico_usuario` ON `Catedratico__Catedratico_usuario`.`usuario` = `Catedratico`.`id_usuario`
    AND (
        `Catedratico__Catedratico_usuario`.`deleted_at` IS NULL
    )
    LEFT JOIN `cat_tipo_usuario` `32f98bb58df14e9d38a158ceb166856e0be3de21` ON `32f98bb58df14e9d38a158ceb166856e0be3de21`.`id` = `Catedratico__Catedratico_usuario`.`id_tipo_usuario`
    LEFT JOIN `usuario` `Catedratico__usuario` ON `Catedratico__usuario`.`usuario` = `Catedratico`.`id_usuario`
    AND (`Catedratico__usuario`.`deleted_at` IS NULL)
    LEFT JOIN `cat_tipo_usuario` `Catedratico__usuario__tipoUsuario` ON `Catedratico__usuario__tipoUsuario`.`id` = `Catedratico__usuario`.`id_tipo_usuario`
WHERE
    `Catedratico`.`deleted_at` IS NULL