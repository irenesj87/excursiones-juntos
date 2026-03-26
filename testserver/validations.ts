/**
 * Validaciones de negocio compartidas (Espejo del Frontend).
 * En una arquitectura de microservicios o monorepo real, este archivo estaría en un paquete
 * npm compartido o en una carpeta 'common' fuera de 'testserver' y 'excursiones'.
 */

/** Valida que el nombre/apellido no esté vacío. */
export const validateName = (name: unknown): name is string =>
	typeof name === "string" && name.trim() !== "";

export const validateSurname = (surname: unknown): surname is string =>
	validateName(surname);

/** Regex para teléfonos españoles (Mismo que en frontend). */
const VALID_PHONE_REGEX =
	/^(\(\+?34\))?\s?(?:6\d|7[1-9])\d(-|\s)?\d{3}(-|\s)?\d{3}$/;

export const validatePhone = (phone: unknown): boolean =>
	typeof phone === "string" && VALID_PHONE_REGEX.test(phone);

/** Regex de email (Mismo que en frontend). */
const VALID_MAIL_REGEX =
	/^([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)@(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,})$/;

export const validateMail = (mail: unknown): boolean =>
	typeof mail === "string" && VALID_MAIL_REGEX.test(mail);

/**
 * Valida la fortaleza de la contraseña.
 * Requisitos: 8+ caracteres, al menos una letra, un número y un carácter especial.
 */
export const validatePassword = (password: unknown): boolean => {
	if (typeof password !== "string") return false;

	const hasMinLength = password.length >= 8;
	const hasLetter = /[A-Za-z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasSpecialChar = /[@$!%*?&.,_-]/.test(password);

	return hasMinLength && hasLetter && hasNumber && hasSpecialChar;
};
