/**
 * Define la estructura de un objeto de usuario para el mock.
 * Esto asegura que los datos de los usuarios registrados en las pruebas
 * tengan el formato esperado.
 */
export interface User {
	id: string;
	name: string;
	surname: string;
	mail: string;
	phone: string;
	password: string; // Contiene el hash de la contraseña, no la contraseña en texto plano.
	excursions: string[];
}

/* Array de usuarios */
// El array de usuarios se inicializa vacío.
// Los usuarios se añadirán dinámicamente a través del endpoint de registro (POST /users).
// Esto evita tener contraseñas (incluso hasheadas) hardcodeadas en el código fuente.
const users: User[] = [];

export default users;
