/**
 * API Gateway
 * -------------------
 * Este servicio actúa como punto de entrada único para el frontend.
 * Se encarga de enrutar las solicitudes a los microservicios adecuados.
 *
 * Funciones esperadas:
 * - Validar autenticación
 * - Redirigir peticiones a users-service, courses-service, etc.
 * - Centralizar manejo de errores y CORS
 * - Exponer endpoints REST para el frontend
 */

// Configuración del gateway
const API_PORT = process.env.PORT || 3000;

// Ejemplo de estructura base
// const usersServiceUrl = process.env.USERS_SERVICE_URL || 'http://localhost:3001';
// const coursesServiceUrl = process.env.COURSES_SERVICE_URL || 'http://localhost:3002';

console.log('API Gateway inicializado en el puerto:', API_PORT);
