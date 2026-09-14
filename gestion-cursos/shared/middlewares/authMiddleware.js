/**
 * authMiddleware.js
 * -----------------
 * Middleware reutilizable para validar sesión o token del usuario.
 *
 * Función esperada:
 * - Leer token desde headers
 * - Verificar autenticación
 * - Adjuntar datos del usuario a la request
 * - Rechazar acceso no autorizado
 */

// Ejemplo base:
// export function authMiddleware(req, res, next) {
//   const token = req.headers.authorization;
//   if (!token) return res.status(401).json({ message: 'No autorizado' });
//   next();
// };

console.log('Middleware de autenticación cargado');
