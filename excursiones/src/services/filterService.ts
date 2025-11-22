import { fetchApi } from "./authService";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

/**
 * Obtiene los filtros de una categoría específica.
 * @param filterName - El nombre de la categoría de filtro (ej. "area").
 * @param fetchOptions - Opciones adicionales para la petición fetch, como un AbortSignal.
 * @returns Un array con los valores del filtro.
 */
export const fetchFilters = async (
	filterName: string,
	fetchOptions: RequestInit = {}
): Promise<string[]> => {
	const url = `${API_BASE_URL}/filters?type=${filterName}`;
	const options: RequestInit = {
		method: "GET",
		// Se combinan las opciones por defecto con las que se pasen como argumento (ej. signal)
		...fetchOptions,
	};

	return fetchApi<string[]>(url, options);
};
