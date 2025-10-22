import { useEffect, useReducer } from "react";
import { useMinDisplayTime } from "./useMinDisplayTime";
import { fetchFilters } from "../services/filterService";

/**
 * @typedef {object} FiltersState
 * @property {string[]} data - Los datos de los filtros.
 * @property {boolean} isLoading - Indica si los datos se están cargando.
 * @property {Error | null} error - Almacena un error si la carga falla.
 * Estado inicial para el reducer que gestiona la carga de filtros.
 */
const initialState = {
	data: [],
	isLoading: true,
	error: null,
};

/**
 * @typedef {{type: 'FETCH_INIT'} | {type: 'FETCH_SUCCESS', payload: string[]} | {type: 'FETCH_FAILURE', payload: Error}} FiltersAction
 */

/**
 * Reducer para manejar el estado de la obtención de filtros.
 * @param {FiltersState} state - El estado actual.
 * @param {FiltersAction} action - La acción a despachar.
 * @returns {FiltersState} El nuevo estado.
 */
function filtersReducer(state, action) {
	switch (action.type) {
		case "FETCH_INIT":
			return { ...initialState, isLoading: true };
		case "FETCH_SUCCESS":
			return { ...state, isLoading: false, data: action.payload, error: null };
		case "FETCH_FAILURE":
			return { ...state, isLoading: false, error: action.payload, data: [] };
		default: {
			// Esta técnica de comprobación de exhaustividad asegura que todos los tipos de acción
			// estén manejados en el switch. Si se añade un nuevo tipo a `FiltersAction`
			// sin añadir su `case`, las herramientas de tipado estático darán un error.
			// Para el error en tiempo de ejecución, incluimos el tipo de acción para facilitar la depuración.
			const unhandledAction = /** @type {{type: string}} */ (action);
			throw new Error(`Acción no soportada: ${unhandledAction.type}`);
		}
	}
}

/**
 * Hook personalizado para obtener los filtros de una categoría específica.
 * @param {string} filterName - El nombre de la categoría de filtro (ej. "area").
 * @returns {FiltersState} El estado de los filtros, que incluye los datos, el estado de carga y cualquier error.
 */
export function useFilters(filterName) {
	const [state, dispatch] = useReducer(filtersReducer, initialState);
	const { startTiming, dispatchWithMinDisplayTime } = useMinDisplayTime(
		dispatch,
		300
	);

	useEffect(() => {
		// AbortController es el enfoque moderno para cancelar peticiones y evitar
		// actualizaciones de estado en componentes desmontados.
		const controller = new AbortController();
		const { signal } = controller;

		const fetchData = async () => {
			startTiming();
			dispatch({ type: "FETCH_INIT" });

			try {
				const data = await fetchFilters(filterName, { signal });
				dispatchWithMinDisplayTime({ type: "FETCH_SUCCESS", payload: data });
			} catch (error) {
				// Si el error es por abortar la petición, no hacemos nada.
				if (error.name === "AbortError") {
					console.log("Petición de filtros abortada.");
					return;
				}

				// Logueamos otros errores para depuración.
				console.error(
					`Error al cargar los filtros para "${filterName}":`,
					error
				);

				// Si es un error de conexión, podemos añadir un log más específico para el desarrollador.
				if (error instanceof TypeError && error.message === "Failed to fetch") {
					console.error(
						"Pista para el desarrollador: El servidor de la API no parece estar respondiendo. ¿Está en marcha?"
					);
				}

				/** @type {Error & {secondaryMessage?: string}} */
				let finalError;
				if (error instanceof TypeError && error.message === "Failed to fetch") {
					finalError = new Error("Error de conexión");
					finalError.secondaryMessage =
						"No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.";
				} else {
					// Para otros errores, usamos el mensaje que venga del servidor.
					finalError = new Error(
						error.message || "No se pudieron cargar los filtros."
					);
				}

				dispatchWithMinDisplayTime({
					type: "FETCH_FAILURE",
					payload: finalError,
				});
			}
		};

		fetchData();

		// Función de limpieza que se ejecuta al desmontar
		return () => {
			controller.abort();
		};
	}, [filterName, dispatchWithMinDisplayTime, startTiming]);

	return state;
}
