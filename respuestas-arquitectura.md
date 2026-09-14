# Respuestas sobre la arquitectura del sistema

## 1. ¿Qué arquitectura implementó?

Se implementó una arquitectura de **microservicios**, con un frontend independiente y un **API Gateway** como punto de entrada central para las solicitudes.

## 2. ¿Qué componentes principales tiene?

- Frontend web separado por roles: administrador, docente y estudiante.
- API Gateway.
- Users Service para usuarios y roles.
- Courses Service para la gestión de cursos.
- Enrollments Service para matrículas y calificaciones.
- Notifications Service para notificaciones.
- Firebase Authentication para la autenticación.
- Firestore como base de datos.
- Middlewares compartidos para autenticación, validación y manejo de errores.

## 3. ¿Cómo separó la presentación de la lógica de negocio?

La presentación está ubicada en los archivos HTML, CSS y JavaScript del frontend. La lógica de negocio se encuentra en los microservicios del backend. El frontend se comunica con el backend mediante solicitudes HTTP al API Gateway.

## 4. ¿Cómo se comunica la aplicación con la base de datos?

El backend utiliza el SDK de **Firebase Admin** para comunicarse con Firestore. El frontend no accede directamente a la base de datos; envía solicitudes al API Gateway, que valida la autenticación y realiza las consultas o modificaciones necesarias en Firestore.

## 5. ¿Qué ventaja tiene la arquitectura utilizada frente a colocar todo el código en un único archivo?

Permite separar responsabilidades, facilita el mantenimiento, mejora las pruebas y permite modificar o escalar un componente sin afectar toda la aplicación. También mejora la organización, la seguridad y la posibilidad de que varios desarrolladores trabajen simultáneamente.

## 6. Si el sistema tuviera 10.000 usuarios, ¿qué cambiaría en su arquitectura?

Se agregarían múltiples instancias de los microservicios detrás de un balanceador de carga, autoescalado en la nube, caché y colas para tareas asíncronas. También se optimizarían las consultas de Firestore mediante índices, paginación y reglas de seguridad. Además, sería necesario incorporar monitoreo, registro de errores, límites de consumo y copias de seguridad.
