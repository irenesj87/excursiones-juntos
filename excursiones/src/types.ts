import { RefObject } from "react";
import * as schemas from "./schemas/userSchema";

/** Re-exporta el tipo User del esquema para uso local y global. */
export type User = schemas.User;

/** Define los posibles valores para la dificultad de una excursión. */
export type DifficultyLevel = "Baja" | "Media" | "Alta";

/** Define la estructura del estado de inicio de sesión. */
export interface LoginState {
	login: boolean;
	user: User | null;
	token: string | null;
}

/** Define la estructura del estado del tema (modo claro/oscuro). */
export interface ThemeState {
	mode: "light" | "dark";
}

/** Define la estructura del estado de los filtros aplicados. */
export interface FilterState {
	area: string[];
	difficulty: string[];
	time: string[];
}

/** Tipo para los nombres de las categorías de filtro. */
export type FilterName = keyof FilterState;

/** Define la estructura de una excursión. */
export interface Excursion {
	id: number | string;
	name: string;
	description: string;
	area: string;
	difficulty: DifficultyLevel;
	time: string;
	imgSrc?: string;
	imgAlt?: string;
}

/** Define la estructura de un error en la aplicación. */
export interface AppError extends Error {
	secondaryMessage?: string;
}

/**
 * Define la respuesta de la API de autenticación.
 */
export interface AuthResponse {
	user: User;
	token: string;
}

/**
 * Define las credenciales para el inicio de sesión.
 */
export type LoginCredentials = Pick<User, "mail"> & { password?: string };

/**
 * Define los datos necesarios para registrar un nuevo usuario.
 */
export type UserRegistration = Omit<User, "id"> & { password?: string };

/**
 * Define la estructura de los valores del formulario de registro, incluyendo la confirmación de contraseña.
 */
export interface RegisterFormValues {
	name: string;
	surname: string;
	phone: string;
	mail: string;
	password: string;
	samePassword: string;
}

/**
 * Define la configuración para un campo de formulario que se renderiza dinámicamente.
 */
export interface FormFieldConfig<T> {
	id: string;
	name: string;
	field: keyof T;
	validationFunction: (
		_value: string,
		_secondValue?: string,
	) => boolean | string;
	autocomplete: string;
	errorMessage?: string;
	inputType?: string;
	ariaDescribedBy?: string;
	ref?: RefObject<HTMLInputElement>;
}
