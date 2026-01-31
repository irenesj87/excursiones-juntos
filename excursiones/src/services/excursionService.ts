import { fetchApi } from "./authService";
import { Excursion } from "../types";

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
 * @returns El usuario actualizado.
 * @throws Lanza un error si la operación falla.
 */
export const joinExcursion = async (
	userMail: string,
	excursionId: string | number,
	token: string | null,
): Promise<unknown> => {
	// La validación del ID debe ser explícita para permitir el ID 0.
	if (excursionId === null || excursionId === undefined) {
		throw new Error("El ID de la excursión es requerido.");
	}
	if (!userMail || !token) {
		throw new Error("Usuario no autenticado o información faltante.");
	}

	// Usamos el endpoint específico que ya existe en el backend para añadir excursiones
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

	return fetchApi(url, options);
};

/**
 * Obtiene los detalles de una excursión por su ID.
 * @param id - El ID de la excursión.
 * @returns Los datos de la excursión.
 */
export const getExcursionById = async (
	id: string | number,
): Promise<Excursion> => {
	const url = `${API_BASE_URL}/excursions/${id}`;
	return fetchApi<Excursion>(url, {});
};

/**
 * Verifica si un usuario está unido a una excursión específica.
 * @param userMail - El correo del usuario.
 * @param excursionId - El ID de la excursión.
 * @returns True si el usuario está unido, false en caso contrario.
 */
export const checkIsUserJoined = async (
	userMail: string | number,
	excursionId: string | number,
	token: string, // Necesitamos el token para consultar el usuario
): Promise<boolean> => {
	// Consultamos el endpoint específico de excursiones del usuario que ya devuelve la lista filtrada
const url = `${API_BASE_URL}/users/${encodeURIComponent(userMail)}/excursions`;
	try {
		const excursions = await fetchApi<Excursion[]>(url, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return excursions.some((e) => String(e.id) === String(excursionId));
	} catch (error) {
		// Si hay error (ej. usuario no encontrado), asumimos false para no bloquear la UI
		return false;
	}
};
