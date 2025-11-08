/** Define los posibles valores para la dificultad de una excursión. */
export type DifficultyLevel = "Baja" | "Media" | "Alta";

export interface User {
	name: string;
	surname: string;
	mail: string;
	phone: string;
	excursions: (string | number)[];
}

export interface LoginState {
	login: boolean;
	user: User | null;
	token: string | null;
}

export interface ThemeState {
	mode: "light" | "dark";
}

export interface FilterState {
	area: string[];
	difficulty: string[];
	time: string[];
}

export interface Excursion {
	id: number | string;
	name: string;
	area: string;
	difficulty: DifficultyLevel;
	time: string;
}
