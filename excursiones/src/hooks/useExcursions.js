import { useReducer } from "react";
import { useMinDisplayTime } from "./useMinDisplayTime";

/**
 * @typedef {object} Excursion
 * @property {string | number} id - El identificador único de la excursión.
 * @property {string} name - El nombre de la excursión.
 * @property {string} date - La fecha de la excursión.
 * @property {string} area - El área donde se realiza la excursión.
 * @property {string} difficulty - La dificultad de la excursión.
 * @property {boolean} isJoined - Indica si el usuario actual se ha unido a la excursión.
 */

/**
 * @typedef {object} ExcursionsState
 * @property {Excursion[]} data - La lista de excursiones.
 * @property {boolean} isLoading - Indica si los datos se están cargando.
 * @property {Error | null} error - Almacena un error si la carga falla.
 */

/** @type {ExcursionsState} */
const excursionsInitialState = {
	data: [],
	isLoading: true,
	error: null,
};

/**
 * @typedef {{type: 'FETCH_INIT'} | {type: 'FETCH_SUCCESS', payload: Excursion[]} | {type: 'FETCH_ERROR', payload: Error}} ExcursionsAction
 */

/**
 * Reducer para manejar el estado de las excursiones.
 * @param {ExcursionsState} state - El estado actual.
 * @param {ExcursionsAction} action - La acción a despachar.
 * @returns {ExcursionsState} - El nuevo estado.
 */
const excursionsReducer = (state, action) => {
	switch (action.type) {
		case "FETCH_INIT":
			return { ...state, isLoading: true, error: null };
		case "FETCH_SUCCESS":
			return { ...state, isLoading: false, data: action.payload };
		case "FETCH_ERROR":
			return { ...state, isLoading: false, error: action.payload, data: [] };
		default: {
			// Esta técnica de comprobación de exhaustividad ayuda a las herramientas de tipado
			// estático a asegurar que todos los casos están cubiertos.
			// Para el error en tiempo de ejecución, incluimos el tipo de acción para facilitar la depuración.
			const unhandledAction = /** @type {{type: string}} */ (action);
			throw new Error(`Acción no soportada: ${unhandledAction.type}`);
		}
	}
};

/**
 * Hook para manejar el estado del fetching de las excursiones.
 * @returns {{
 *  excursionsState: ExcursionsState,
 *  handleExcursionsFetchStart: () => void,
 *  handleExcursionsFetchSuccess: (excursions: Excursion[]) => void,
 *  handleExcursionsFetchEnd: (error: Error | null) => void
 * }} - El estado de las excursiones y los manejadores de eventos.
 */
export const useExcursions = () => {
	const [excursionsState, excursionsDispatch] = useReducer(
		excursionsReducer,
		excursionsInitialState
	);
	const { startTiming, dispatchWithMinDisplayTime } = useMinDisplayTime(
		excursionsDispatch,
		500
	);

	/**
	 * Inicia el proceso de carga de excursiones.
	 */
	const handleExcursionsFetchStart = () => {
		startTiming();
		excursionsDispatch({ type: "FETCH_INIT" });
	};

	/**
	 * Maneja el éxito de la carga de excursiones.
	 * Despacha la acción de éxito después de un tiempo mínimo de visualización.
	 * @param {Excursion[]} excursions - Los datos de las excursiones cargadas.
	 */
	const handleExcursionsFetchSuccess = (excursions) => {
		dispatchWithMinDisplayTime({
			type: "FETCH_SUCCESS",
			payload: excursions,
		});
	};

	/**
	 * Maneja el final de la carga de excursiones, incluyendo errores.
	 * Despacha la acción de error si existe.
	 * @param {Error | null} error - El error ocurrido durante la carga, si existe.
	 */
	const handleExcursionsFetchEnd = (error) => {
		if (error) {
			dispatchWithMinDisplayTime({ type: "FETCH_ERROR", payload: error });
		}
	};

	return {
		excursionsState,
		handleExcursionsFetchStart,
		handleExcursionsFetchSuccess,
		handleExcursionsFetchEnd,
	};
};
