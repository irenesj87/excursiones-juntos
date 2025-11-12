import { useReducer } from "react";
import { useMinDisplayTime } from "./useMinDisplayTime";
import type { Excursion } from "../types";

// Definimos los tipos de estado y acción con TypeScript
export interface ExcursionsState {
	data: Excursion[];
	isLoading: boolean;
	error: Error | null;
}

type ExcursionsAction =
	| { type: "FETCH_INIT" }
	| { type: "FETCH_SUCCESS"; payload: Excursion[] }
	| { type: "FETCH_ERROR"; payload: Error };

const excursionsInitialState: ExcursionsState = {
	data: [],
	isLoading: true,
	error: null,
};

/**
 * Reducer para manejar el estado de las excursiones.
 */
const excursionsReducer = (
	state: ExcursionsState,
	action: ExcursionsAction
): ExcursionsState => {
	switch (action.type) {
		case "FETCH_INIT":
			return { ...state, isLoading: true, error: null };
		case "FETCH_SUCCESS":
			return { ...state, isLoading: false, data: action.payload };
		case "FETCH_ERROR":
			return { ...state, isLoading: false, error: action.payload, data: [] };
		default: {
			// TypeScript se asegurará de que todos los casos de acción estén cubiertos.
			// Si se añade una nueva acción y no se maneja aquí, TypeScript dará un error.
			throw new Error(
				`Acción no soportada: ${(action as { type: string }).type}`
			);
		}
	}
};

/**
 * Hook para manejar el estado del fetching de las excursiones.
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
	 */
	const handleExcursionsFetchSuccess = (excursions: Excursion[]) => {
		dispatchWithMinDisplayTime({
			type: "FETCH_SUCCESS",
			payload: excursions,
		});
	};

	/**
	 * Maneja el final de la carga de excursiones, incluyendo errores.
	 */
	const handleExcursionsFetchEnd = (error: Error | null) => {
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
