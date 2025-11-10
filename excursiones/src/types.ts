/** Define los posibles valores para la dificultad de una excursión. */
export type DifficultyLevel = "Baja" | "Media" | "Alta";

/** Define la estructura de un usuario en la aplicación. */
export interface User {
	name: string;
	surname: string;
	mail: string;
	phone: string;
	excursions: (string | number)[];
}

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

/** Define la estructura de una excursión. */
export interface Excursion {
	id: number | string;
	name: string;
	area: string;
	difficulty: DifficultyLevel;
	time: string;
}

/** Define la estructura de un error en la aplicación. */
export interface AppError extends Error {
	secondaryMessage?: string;
}
