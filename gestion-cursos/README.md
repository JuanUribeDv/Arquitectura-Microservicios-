# Gestión de Cursos

Proyecto base para una plataforma de gestión educativa con arquitectura orientada a microservicios.

## Estructura principal

- `frontend/`: interfaz en HTML, CSS y JavaScript vanilla.
- `services/`: microservicios del backend.
- `shared/`: utilidades compartidas y configuración común.

## Tecnologías sugeridas

- Frontend: HTML, CSS, JavaScript vanilla
- Backend: Node.js + Express
- Autenticación: Firebase Auth 
- Comunicación: API Gateway + REST

## Inicio rápido

1. Abrir `frontend/index.html` en el navegador.
2. Ajustar los endpoints del API Gateway en `frontend/js/services/apiClient.js`.
3. Implementar cada microservicio en `services/`.

## Roles del sistema

- Administrador
- Docente
- Estudiante
