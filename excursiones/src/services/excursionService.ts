import { fetchApi } from "./authService";
import { Excursion, User } from "../types";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

interface SearchExcursionsParams {
	debouncedSearch?: string;
	area: string[];
	difficulty: string[];
	time: string[];
}

/**
 * Busca excursiones basadas en un conjunto de filtros.
 * @param params - Un objeto que contiene los criterios de búsqueda.
 * @returns Un array de excursiones que coinciden con los filtros.
 */
export const searchExcursions = async ({
	debouncedSearch,
	area,
	difficulty,
	time,
}: SearchExcursionsParams): Promise<Excursion[]> => {
	const params = new URLSearchParams();
	if (debouncedSearch) params.append("q", debouncedSearch);

	// Itera sobre cada categoría de filtro y añade sus valores a los parámetros.
	const filterMap = { area, difficulty, time };
	for (const [key, values] of Object.entries(filterMap)) {
		for (const value of values) {
			params.append(key, value);
		}
	}

	const url = `${API_BASE_URL}/excursions?${params.toString()}`;
	// Usamos GET por defecto, no es necesario pasar 'options' si no hay headers o body.
	return fetchApi<Excursion[]>(url, {});
};

/**
 * Permite a un usuario unirse a una excursión.
 * @param userMail - El correo del usuario.
 * @param excursionId - El ID de la excursión.
 * @param token - El token de autenticación del usuario.
 * @returns Los datos del usuario actualizados.
 * @throws Lanza un error si la operación falla.
 */
export const joinExcursion = async (
	userMail: string,
	excursionId: string | number,
	token: string | null
): Promise<User> => {
	// La validación del ID debe ser explícita para permitir el ID 0.
	if (excursionId === null || excursionId === undefined) {
		throw new Error("El ID de la excursión es requerido.");
	}
	if (!userMail || !token) {
		throw new Error("Usuario no autenticado o información faltante.");
	}

	const url = `${API_BASE_URL}/users/${userMail}/excursions`;
	const options: RequestInit = {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ excursionId }),
	};

	return fetchApi<User>(url, options);
};
