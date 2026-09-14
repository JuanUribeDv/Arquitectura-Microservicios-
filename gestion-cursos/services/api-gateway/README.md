# API Gateway

Este servicio centraliza las peticiones del frontend y las redirige a los microservicios.

## Objetivo

- Exponer un único punto de entrada.
- Validar autenticación y autorización.
- Gestionar tasas de consumo y agregación.

## Endpoints sugeridos

- `GET /api/users`
- `GET /api/courses`
- `POST /api/enrollments`
