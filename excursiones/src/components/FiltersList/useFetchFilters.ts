import { useEffect, useReducer } from "react";
import { useMinDisplayTime } from "../../hooks/useMinDisplayTime";
import { fetchFilters } from "../../services/filterService";
import { AppError } from "../../types";

// Estado inicial para el reducer.
const initialState: FiltersState = {
	data: [],
	isLoading: true,
	error: null,
};

// Tipo para el estado manejado por el reducer.
interface FiltersState {
	data: string[];
	isLoading: boolean;
	error: Error | null;
}

/**
 * Reducer para manejar el estado de la obtención de filtros.
 */
type FiltersAction =
	| { type: "FETCH_INIT" }
	| { type: "FETCH_SUCCESS"; payload: string[] }
	| { type: "FETCH_FAILURE"; payload: Error };
function filtersReducer(
	state: FiltersState,
	action: FiltersAction
): FiltersState {
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
			// Este código es inalcanzable si todos los casos están cubiertos.
			throw new Error(`Acción no soportada en filtersReducer`);
		}
	}
}

/**
 * Hook personalizado para obtener los filtros de una categoría específica.
 */
export function useFilters(filterName: string): FiltersState {
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

			// Función para manejar los errores de forma centralizada
			const handleError = (error: unknown) => {
				if (error instanceof Error) {
					if (error.name === "AbortError") {
						console.log("Petición de filtros abortada.");
						return;
					}

					console.error(
						`Error al cargar los filtros para "${filterName}":`,
						error
					);

					if (
						error instanceof TypeError &&
						error.message === "Failed to fetch"
					) {
						console.error(
							"Pista para el desarrollador: El servidor de la API no parece estar respondiendo. ¿Está en marcha?"
						);
					}

					let finalError: Error;
					if (
						error instanceof TypeError &&
						error.message === "Failed to fetch"
					) {
						finalError = new Error("Error de conexión");
						(finalError as AppError).secondaryMessage =
							"No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.";
					} else {
						finalError = new Error(
							error.message || "No se pudieron cargar los filtros."
						);
					}

					dispatchWithMinDisplayTime({
						type: "FETCH_FAILURE",
						payload: finalError,
					});
				} else {
					console.error(
						`Error desconocido al cargar los filtros para "${filterName}":`,
						error
					);
					dispatchWithMinDisplayTime({
						type: "FETCH_FAILURE",
						payload: new Error("Ocurrió un error desconocido."),
					});
				}
			};

			try {
				const data = await fetchFilters(filterName, { signal });
				dispatchWithMinDisplayTime({ type: "FETCH_SUCCESS", payload: data });
			} catch (error) {
				handleError(error);
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
