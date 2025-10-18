const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

/**
 * Obtiene los filtros de una categoría específica.
 * @param {string} filterName - El nombre de la categoría de filtro (ej. "area").
 * @param {object} [fetchOptions] - Opciones adicionales para la petición fetch, como un AbortSignal.
 * @returns {Promise<string[]>} Un array con los valores del filtro.
 */
export const fetchFilters = async (filterName, fetchOptions = {}) => {
	const url = `${API_BASE_URL}/filters?type=${filterName}`;
	/** @type {object} */
	const options = {
		method: "GET",
		mode: "cors",
		headers: { "Content-Type": "application/json" },
		// Se combinan las opciones por defecto con las que se pasen como argumento (ej. signal)
		...fetchOptions,
	};

	const response = await fetch(url, options);
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		const errorMessage =
			errorData.message ||
			`Error al cargar filtros de ${filterName}: ${response.status}`;
		throw new Error(errorMessage);
	}
	return response.json();
};
