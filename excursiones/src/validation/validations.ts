/**
 * Valida que el nombre del usuario no esté vacío después de quitarle los espacios en blanco.
 * @param name - El nombre a validar.
 * @returns - Retorna true si el nombre es válido, de lo contrario false.
 */
export function validateName(name: string): boolean {
	return name.trim() !== "";
}

/**
 * Valida que los apellidos del usuario no estén vacíos después de quitarles los espacios en blanco.
 * @param surname - Los apellidos a validar.
 * @returns - Retorna true si los apellidos son válidos, de lo contrario false.
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
 * Longitud mínima permitida para las contraseñas.
 * Se exporta para que la UI pueda mostrar este valor dinámicamente.
 */
export const MIN_PASSWORD_LENGTH = 8;

/**
 * Reglas individuales para la validación de contraseñas.
 */
export const PASSWORD_RULES = {
	hasMinLength: (password: string) => password.length >= MIN_PASSWORD_LENGTH,
	hasLetter: (password: string) => /[A-Za-z]/.test(password),
	hasNumber: (password: string) => /\d/.test(password),
	hasSpecialChar: (password: string) => /[@$!%*?&.,_-]/.test(password),
};

/**
 * Valida la fortaleza de una contraseña.
 * Retorna `true` si cumple con todos los requisitos de seguridad establecidos.
 * @param password - La contraseña a validar.
 * @returns - Booleano que indica si la contraseña es válida.
 */
export function validatePassword(password: string): boolean {
	return Object.values(PASSWORD_RULES).every((rule) => rule(password));
}

/**
 * Comprueba que dos contraseñas coincidan.
 * @param password - La contraseña original.
 * @param samePassword - La contraseña de confirmación.
 * @returns - Booleano que indica si ambas contraseñas son iguales.
 */
export function validateSamePassword(
	password: string,
	samePassword: string,
): boolean {
	return password === samePassword;
}
