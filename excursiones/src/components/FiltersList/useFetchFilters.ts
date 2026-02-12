import { useEffect, useReducer } from "react";
import { useMinDisplayTime } from "../../hooks/useMinDisplayTime";
import { fetchFilters } from "../../services/filterService";
import { AppError } from "../../types";

const MIN_DISPLAY_TIME_MS = 300;
const FAILED_TO_FETCH_MESSAGE = "Failed to fetch";
const ABORT_ERROR_NAME = "AbortError";
const CONNECTION_ERROR_MESSAGE = "Error de conexión";
const CONNECTION_ERROR_SECONDARY_MESSAGE =
	"No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.";

// Estado inicial para el hook.
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

// Unión discriminada para manejar el estado de la obtención de filtros.
type FiltersAction =
	| { type: "FETCH_INIT" }
	| { type: "FETCH_SUCCESS"; payload: string[] }
	| { type: "FETCH_FAILURE"; payload: Error };
function filtersReducer(
	state: FiltersState,
	action: FiltersAction,
): FiltersState {
	switch (action.type) {
		case "FETCH_INIT":
			return { ...initialState, isLoading: true };
		case "FETCH_SUCCESS":
			return { ...state, isLoading: false, data: action.payload, error: null };
		case "FETCH_FAILURE":
			return { ...state, isLoading: false, error: action.payload, data: [] };
		default: {
			throw new Error(`Acción no soportada en filtersReducer`);
		}
	}
}

/**
 * Hook personalizado para obtener los filtros de una categoría específica (ej. area, dificultad, tiempo estimado).
 * @param filterName El nombre del filtro a obtener (ej. "area", "difficulty", "estimatedTime").
 * @return El estado actual de la obtención de filtros, incluyendo los datos, el estado de carga y cualquier error.
 */
export function useFilters(filterName: string): FiltersState {
	const [state, dispatch] = useReducer(filtersReducer, initialState);
	const { startTiming, dispatchWithMinDisplayTime } = useMinDisplayTime(
		dispatch,
		MIN_DISPLAY_TIME_MS,
	);

	useEffect(() => {
		// AbortController es el enfoque moderno para cancelar peticiones y evitar actualizaciones de estado en
		// componentes desmontados.
		const controller = new AbortController();
		const { signal } = controller;

		const fetchData = async () => {
			// Iniciamos el temporizador para asegurar que el estado de carga se muestre durante al menos el tiempo mínimo.
			startTiming();
			// Disparamos la acción de inicio de carga.
			dispatch({ type: "FETCH_INIT" });

			// Función para manejar los errores de forma centralizada
			// Esta función maneja tanto errores conocidos (instancias de Error) como errores desconocidos 
			// (cualquier otro tipo).
			// Al no saber el tipo de error se utiliza el unknown.
			const handleError = (error: unknown) => {
				if (error instanceof Error) {
					if (error.name === ABORT_ERROR_NAME) {
						console.log("Petición de filtros abortada.");
						return;
					}

					console.error(
						`Error al cargar los filtros para "${filterName}":`,
						error,
					);

					// Si ha habido un error al hacer fetch
					if (
						error instanceof TypeError &&
						error.message === FAILED_TO_FETCH_MESSAGE
					) {
						console.error(
							"Pista para el desarrollador: El servidor de la API no parece estar respondiendo. ¿Está en marcha?",
						);
					}

					// Creamos un nuevo error con un mensaje más amigable para el usuario, y si es un error de conexión, añadimos un mensaje secundario.
					let finalError: Error;
					if (
						error instanceof TypeError &&
						error.message === FAILED_TO_FETCH_MESSAGE
					) {
						finalError = new Error(CONNECTION_ERROR_MESSAGE);
						(finalError as AppError).secondaryMessage =
							CONNECTION_ERROR_SECONDARY_MESSAGE;
					} else {
						finalError = new Error(
							error.message || "No se pudieron cargar los filtros.",
						);
					}
					// Se envía el error al reducer, asegurando que se respete el tiempo mínimo de visualización 
					// del estado de carga.
					dispatchWithMinDisplayTime({
						type: "FETCH_FAILURE",
						payload: finalError,
					});
				} else {
					console.error(
						`Error desconocido al cargar los filtros para "${filterName}":`,
						error,
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
