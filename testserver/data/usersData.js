/* Array de usuarios */
// El array de usuarios se inicializa vacío.
// Los usuarios se añadirán dinámicamente a través del endpoint de registro (POST /users).
// Esto evita tener contraseñas (incluso hasheadas) hardcodeadas en el código fuente.
const users = [];

module.exports = users;
