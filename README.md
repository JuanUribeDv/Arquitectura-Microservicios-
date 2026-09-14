# Sistema de Gestión de Cursos

Sistema académico construido con frontend web, API Gateway, microservicios y Firebase.

## Funcionalidades

- Administrador: crea cursos, registra usuarios, asigna roles y consulta información.
- Docente: consulta sus cursos y estudiantes, y registra calificaciones.
- Estudiante: consulta sus cursos, se matricula y consulta sus calificaciones.

## Arquitectura

El frontend se sirve desde `gestion-cursos/frontend` y se comunica con el API Gateway en `http://localhost:3000`. El gateway enruta las solicitudes a los servicios de usuarios, cursos, matrículas y notificaciones. Firebase Authentication gestiona las sesiones y Firestore almacena usuarios, cursos, matrículas y calificaciones.

## Configuración

1. Habilita Email/Password en Firebase Authentication.
2. Descarga una clave privada de Firebase Admin y guárdala como `gestion-cursos/shared/firebase-admin-config/serviceAccountKey.json`.
3. Verifica que el `project_id` de esa clave sea `arq-microservicios-f5474`.
4. Configura la API key web en `gestion-cursos/frontend/js/config/firebaseConfig.js`.

## Ejecución

Instala dependencias una vez en cada carpeta con `package.json` y ejecuta los servicios en terminales separadas:

```powershell
cd gestion-cursos/services/users-service; npm start
cd gestion-cursos/services/api-gateway; npm start
cd gestion-cursos/services/courses-service; npm start
cd gestion-cursos/services/enrollments-service; npm start
cd gestion-cursos/services/notifications-service; npm start
cd gestion-cursos/frontend; npm start
```

Abre `http://localhost:8080`. Para pruebas locales, `ALLOW_PUBLIC_ROLE_ASSIGNMENT=true` permite seleccionar el rol durante el registro; en producción debe ser `false` y los roles deben asignarse desde el panel administrador.
