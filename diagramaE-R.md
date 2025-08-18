erDiagram
    ALUMNO ||--o{ RESPONSABLE : tiene
    RESPONSABLE }o--|| TIPO_PARENTESCO : pertenece_a
    USUARIO }o--|| TIPO_USUARIO : tipo
    CATEDRATICO ||--|| USUARIO : usuario
    GRADO ||--o{ GRADO_CICLO : tiene
    CICLO ||--o{ GRADO_CICLO : tiene
    GRADO }o--|| NIVEL_ACADEMICO : nivel
    GRADO }o--|| JORNADA : jornada
    ASIGNACION_CATEDRATICO }o--|| GRADO_CICLO : grado_ciclo
    ASIGNACION_CATEDRATICO }o--|| CATEDRATICO : catedratico
    ASIGNACION_CATEDRATICO }o--|| CURSO : curso

    ALUMNO {
      nvarchar cui PK
      nvarchar primer_nombre
      nvarchar segundo_nombre
      nvarchar tercer_nombre
      nvarchar primer_apellido
      nvarchar segundo_apellido
      nvarchar telefono
      enum genero
      datetime created_at
      datetime updated_at
      datetime deleted_at
    }
    RESPONSABLE {
      int id PK
      nvarchar id_responsable
      nvarchar primer_nombre
      nvarchar segundo_nombre
      nvarchar tercer_nombre
      nvarchar primer_apellido
      nvarchar segundo_apellido
      nvarchar telefono
      int id_parentesco
      nvarchar cui_alumno
      datetime created_at
      datetime updated_at
      datetime deleted_at
    }
    TIPO_PARENTESCO {
      int id PK
      nvarchar descripcion
      datetime created_at
      datetime updated_at
      datetime deleted_at
    }
    USUARIO {
      nvarchar usuario PK
      nvarchar contrasena
      nvarchar primer_nombre
      nvarchar segundo_nombre
      nvarchar tercer_nombre
      nvarchar primer_apellido
      nvarchar segundo_apellido
      int id_tipo_usuario
      nvarchar telefono
      smallint cambiar_contrasena
      datetime created_at
      datetime updated_at
      datetime deleted_at
    }
    TIPO_USUARIO {
      int id PK
      nvarchar descripcion
      datetime created_at
    }
    CATEDRATICO {
      nvarchar dpi PK
      nvarchar id_usuario
      datetime created_at
      datetime updated_at
      datetime deleted_at
    }
    GRADO {
      int id PK
      nvarchar nombre
      int id_nivel
      int id_jornada
      datetime created_at
      datetime updated_at
      datetime deleted_at
    }
    NIVEL_ACADEMICO {
      int id PK
      nvarchar descripcion
      datetime created_at
      datetime updated_at
      datetime deleted_at
    }
    JORNADA {
      int id PK
      nvarchar descripcion
      datetime created_at
      datetime updated_at
      datetime deleted_at
    }
    GRADO_CICLO {
      int id PK
      int id_grado
      int id_ciclo
      decimal precio_pago
      int cantidad_pagos
      decimal precio_inscripcion
      datetime created_at
      datetime updated_at
      datetime deleted_at
    }
    CICLO {
      int id PK
      nvarchar descripcion
      date fecha_fin
      datetime created_at
      datetime updated_at
      datetime deleted_at
    }
    CURSO {
      int id PK
      nvarchar nombre
      datetime created_at
      datetime updated_at
      datetime deleted_at
    }
    ASIGNACION_CATEDRATICO {
      int id PK
      int id_grado_ciclo
      int id_catedratico
      int id_curso
      int nota_maxima
      int nota_aprobada
      datetime created_at
      datetime updated_at
      datetime deleted_at
    }