/**
 * Este archivo centraliza las definiciones de tipos y interfaces para el proyecto.
 * Reemplaza el antiguo `types.js` con la potencia del tipado estático de TypeScript.
 */

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
	difficulty: string;
	time: string;
}
