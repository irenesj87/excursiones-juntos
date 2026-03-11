/**
 * Define la estructura de un objeto de usuario.
 */
export interface User {
	/** El identificador único del usuario (UUID). */
	id: string;
	/** El nombre de pila del usuario. */
	name: string;
	/** El apellido del usuario. */
	surname: string;
	/** La dirección de correo electrónico del usuario, utilizada para el inicio de sesión. */
	mail: string;
	/** El número de teléfono del usuario. */
	phone: string;
	/** El hash de la contraseña del usuario. Nunca debe contener la contraseña en texto plano. */
	password: string;
	/** Un array de IDs de las excursiones a las que el usuario se ha apuntado. */
	excursions: string[];
}

/**
 * Array que almacena los usuarios de la aplicación.
 * Se inicializa vacío para evitar el almacenamiento de datos sensibles (contraseñas hasheadas) en el código fuente.
 * Los usuarios se añaden dinámicamente a través del endpoint de registro (`POST /users`).
 */
const users: User[] = [];

export default users;
