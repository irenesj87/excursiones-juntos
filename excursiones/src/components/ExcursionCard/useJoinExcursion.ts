import { useState } from "react";
import { getSafeErrorMessage } from "../../utils/errorUtils";

/**
 * Define el tipo de la función que se ejecuta al unirse a una excursión.
 */
type OnJoinFunction = (_id: string | number) => Promise<void>;

/**
 * Define la forma del objeto que devuelve el hook.
 */
interface UseJoinExcursionReturn {
	isJoining: boolean;
	joinError: string | null;
	handleJoin: (_id: string | number) => Promise<void>;
	clearError: () => void;
}

/**
 * Hook para gestionar la lógica de unirse a una excursión. Encapsula el estado de carga, el manejo de errores y la llamada a la API.
 */
export const useJoinExcursion = (
	onJoin: OnJoinFunction
): UseJoinExcursionReturn => {
	// Variable que sirve para controlar el Spinner de carga del botón "Apuntarse". Cuando el usuario lo pulsa el botón esta
	// variable se pone a true y el botón se deshabilita
	const [isJoining, setIsJoining] = useState(false);
	// Variable para guardar el error si la API falla
	const [joinError, setJoinError] = useState<string | null>(null);

	// Función que llama el componente ExcursionCard cuando el usuario hace click en el botón para apuntarse a la excursión
	const handleJoin = async (id: string | number) => {
		if (isJoining) return;
		setIsJoining(true);
		setJoinError(null);
		try {
			await onJoin(id);
			// El éxito es manejado por el componente padre, que actualizará `isJoined`.
			// El estado `isJoining` se resolverá cuando el componente se vuelva a renderizar sin el botón.
		} catch (error: unknown) {
			// El error técnico ya se loguea en el componente padre (Excursions.js).
			// Aquí solo nos encargamos de capturar el mensaje para la UI.
			setJoinError(getSafeErrorMessage(error));
			setIsJoining(false);
		}
	};

	const clearError = () => setJoinError(null);

	return { isJoining, joinError, handleJoin, clearError };
};
