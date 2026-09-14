/**
 * validateRequest.js
 * ------------------
 * Middleware para validar payloads entrantes.
 *
 * Función esperada:
 * - Comprobar campos obligatorios
 * - Validar formato de email, roles, etc.
 * - Rechazar datos incompletos
 */

// Ejemplo base:
// export function validateRequest(schema) {
//   return (req, res, next) => {
//     const { error } = schema.validate(req.body);
//     if (error) return res.status(400).json({ message: error.details[0].message });
//     next();
//   };
// }

console.log('Validador de peticiones cargado');
