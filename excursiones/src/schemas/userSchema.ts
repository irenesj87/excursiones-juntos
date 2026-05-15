import { z } from "zod";
import {
	validateMail,
	validateName,
	validatePhone,
	validateSurname,
} from "../validation/validations";

/**
 * Esquema de validación Zod para el objeto User.
 * Es la **Fuente Única de Verdad** para la estructura del usuario.
 */
export const userSchema = z.object({
	id: z.string().or(z.number()),
	name: z.string().refine(validateName, {
		message: "El nombre no puede estar vacío.",
	}),
	surname: z.string().refine(validateSurname, {
		message: "El apellido no puede estar vacío.",
	}),
	mail: z.string().refine(validateMail, {
		message: "El formato del correo electrónico no es válido.",
	}),
	phone: z.string().refine(validatePhone, {
		message: "El formato del teléfono no es válido.",
	}),
	excursions: z.array(z.string().or(z.number())),
});

/**
 * Tipo `User` derivado automáticamente del `userSchema`.
 * Esto garantiza que los tipos de TypeScript y las validaciones de Zod estén siempre sincronizados.
 */
export type User = z.infer<typeof userSchema>;
