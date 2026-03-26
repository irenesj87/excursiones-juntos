/**
 * Valida que el nombre no esté vacío después de quitarle los espacios en blanco.
 * @param name - El nombre a validar.
 * @returns - Retorna true si el nombre es válido, de lo contrario false.
 */
export function validateName(name: string): boolean {
	return name.trim() !== "";
}

/**
 * Valida que el apellido no esté vacío después de quitarle los espacios en blanco.
 * @param surname - El apellido a validar.
 * @returns - Retorna true si el apellido es válido, de lo contrario false.
 */
export function validateSurname(surname: string): boolean {
	// Reutiliza la misma lógica de validación que para el nombre para evitar duplicación.
	return validateName(surname);
}

/**
 * Regex para validar teléfonos españoles. Se desglosa así:
 * ^(\\(\\+?34\\))?   - Prefijo opcional +34, con o sin paréntesis.
 * \\s?               - Espacio opcional.
 * (?:6\d|7[1-9])\d   - Valida los 3 primeros dígitos, que deben ser '6xx' o '7[1-9]x'.
 * (-|\\s)?\\d{3}     - Bloque de 3 dígitos, precedido opcionalmente por espacio o guion.
 * (-|\\s)?\\d{3}$    - Bloque final de 3 dígitos, con la misma lógica de separador.
 */
const VALID_PHONE_REGEX =
	/^(\(\+?34\))?\s?(?:6\d|7[1-9])\d(-|\s)?\d{3}(-|\s)?\d{3}$/;

/**
 * Valida el formato de un número de teléfono español.
 * Acepta formatos con o sin prefijo (+34), con o sin paréntesis, y con o sin espacios/guiones.
 * @param phone - El número de teléfono a validar.
 * @returns - Retorna true si el teléfono es válido, de lo contrario false.
 */
export function validatePhone(phone: string): boolean {
	return VALID_PHONE_REGEX.test(phone);
}

/**
 * Expresión regular simplificada para la validación de email.
 * No se dejan poner emails con IPs (ej: usuario@[192.1.1.1]) y partes locales entre comillas
 * (ej: "nombre con espacios"@dominio.com) para reducir la complejidad y evitar posibles ataques ReDoS, algo que sí está
 * permitido en el estándar para correos electrónicos.
 */
const VALID_MAIL_REGEX =
	/^([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)@(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,})$/;

/**
 * Valida el formato de una dirección de correo electrónico.
 * @param mail - El correo electrónico a validar.
 * @returns - Retorna true si el correo es válido, de lo contrario false.
 */
export function validateMail(mail: string): boolean {
	return VALID_MAIL_REGEX.test(mail);
}

/**
 * Lista de requisitos para validar la fortaleza de una contraseña.
 * Cada requisito tiene un mensaje de error y una función que verifica si la contraseña cumple con ese requisito.
 */
export const PASSWORD_REQUIREMENTS: {
	message: string;
	isValid: (password: string) => boolean;
}[] = [
	{
		message: "Debe tener al menos 8 caracteres",
		isValid: (password) => password.length >= 8,
	},
	{
		message: "Debe tener al menos una letra",
		isValid: (password) => /[A-Za-z]/.test(password),
	},
	{
		message: "Debe tener al menos un número",
		isValid: (password) => /\d/.test(password),
	},
	{
		message: "Debe tener al menos un carácter especial (ej: @$!%*?&.,_-)",
		isValid: (password) => /[@$!%*?&.,_-]/.test(password),
	},
];

/**
 * Valida la fortaleza de una contraseña.
 * Retorna `true` si es válida, o un `string` con el error específico si no lo es.
 * @param password - La contraseña a validar.
 * @returns - Retorna `true` si la contraseña es válida, o un mensaje de error.
 */
export function validatePassword(password: string): true | string {
	// Itera sobre los requisitos y retorna el primer mensaje de error que encuentre.
	for (const requirement of PASSWORD_REQUIREMENTS) {
		if (!requirement.isValid(password)) {
			return requirement.message;
		}
	}
	return true;
}

/**
 * Comprueba que dos contraseñas coincidan y que la segunda contraseña cumpla con los requisitos de validación.
 * @param password - La contraseña original.
 * @param samePassword - La contraseña de confirmación.
 * @returns - Retorna `true` si ambas contraseñas son iguales y válidas, o un `string` con el mensaje de error.
 */
export function validateSamePassword(
	password: string,
	samePassword: string,
): true | string {
	const passwordValidationResult = validatePassword(samePassword);
	if (passwordValidationResult !== true) {
		return passwordValidationResult; // Retorna el error específico de la validación de la contraseña.
	}
	if (password !== samePassword) {
		return "Las contraseñas no coinciden.";
	}
	return true;
}
