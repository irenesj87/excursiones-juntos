import { useReducer } from "react";
import { useMinDisplayTime } from "./useMinDisplayTime";
import type { Excursion, AppError } from "../types";

// Definimos los tipos de estado y acción con TypeScript
export type ExcursionsState =
	| { status: "loading"; readonly data: readonly Excursion[] }
	| { status: "success"; readonly data: readonly Excursion[] }
	| {
			status: "error";
			readonly data: readonly Excursion[];
			readonly error: AppError;
	};

type ExcursionsAction =
	| { type: "FETCH_INIT" }
	| { type: "FETCH_SUCCESS"; payload: readonly Excursion[] }
	| { type: "FETCH_ERROR"; payload: AppError };

const excursionsInitialState: ExcursionsState = {
	status: "loading",
	data: [],
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
			return { status: "loading", data: state.data };
		case "FETCH_SUCCESS":
			return { status: "success", data: action.payload };
		case "FETCH_ERROR":
			return { status: "error", error: action.payload, data: [] };
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
	const handleExcursionsFetchSuccess = (excursions: readonly Excursion[]) => {
		dispatchWithMinDisplayTime({
			type: "FETCH_SUCCESS",
			payload: excursions,
		});
	};

	/**
	 * Maneja el final de la carga de excursiones, incluyendo errores.
	 */
	const handleExcursionsFetchEnd = (error: AppError | null) => {
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
