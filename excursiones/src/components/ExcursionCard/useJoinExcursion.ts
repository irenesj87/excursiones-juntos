import { useState, useEffect, useRef } from "react";
import { getSafeErrorMessage } from "../../utils/errorUtils";

/**
 * Define el tipo de la función que se ejecuta al unirse a una excursión.
 */
type OnJoinFunction = (id: string | number) => Promise<void>;

/**
 * Definimos los estados posibles mediante una Unión Discriminada.
 */
type JoinState =
	| { status: "idle" }
	| { status: "joining" }
	| { status: "error"; error: string };

/**
 * Define la forma del objeto que retorna el hook.
 */
interface UseJoinExcursionReturn {
	isJoining: boolean;
	joinError: string | null;
	handleJoin: (id: string | number) => Promise<void>;
	clearError: () => void;
}

/**
 * Hook para gestionar la lógica de unirse a una excursión. Encapsula el estado de carga, el manejo de errores y la llamada a la API.
 */
export const useJoinExcursion = (
	onJoin: OnJoinFunction
): UseJoinExcursionReturn => {
	// Unificamos el estado en una sola variable
	const [state, setState] = useState<JoinState>({ status: "idle" });
	const isMounted = useRef(true);

	useEffect(() => {
		return () => {
			// Esta función se ejecuta automáticamente justo antes de que React
			// elimine el componente del DOM (desmontaje).
			isMounted.current = false;
		};
	}, []);

	// Función que llama el componente ExcursionCard cuando el usuario hace click en el botón para apuntarse a la excursión
	const handleJoin = async (id: string | number) => {
		// Protección contra doble click basada en el estado actual
		if (state.status === "joining") return;
		// El usuario se intenta unir a la excursión
		setState({ status: "joining" });
		// Se comprueba si hay error o no a la hora de unirse a la excursión.
		try {
			await onJoin(id);
			// Si tiene éxito, volvemos al estado inicial (idle)
			if (isMounted.current) {
				setState({ status: "idle" });
			}
		} catch (error: unknown) {
			if (isMounted.current) {
				setState({ status: "error", error: getSafeErrorMessage(error) });
			}
		}
	};

	// Función que elimina el error de manera manual. Es útil si se quiere poner una x en la alerta para cerrarla.
	const clearError = () => {
		if (state.status === "error") setState({ status: "idle" });
	};

	// Derivamos los valores para mantener la compatibilidad con la interfaz original
	return {
		isJoining: state.status === "joining",
		// Si hay error, el error va a ser un string y si no lo hay, el error es null
		joinError: state.status === "error" ? state.error : null,
		handleJoin,
		clearError,
	};
};
