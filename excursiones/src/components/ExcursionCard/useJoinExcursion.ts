import { useState } from "react";
import { getSafeErrorMessage } from "../../utils/errorUtils";

/**
 * Define el tipo de la función que se ejecuta al unirse a una excursión.
 */
type OnJoinFunction = (id: string | number) => Promise<void>;

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
	// Variable que sirve para controlar el Spinner de carga del botón "Apuntarse". Cuando el usuario pulsa el botón, esta
	// variable se pone a true y el botón se deshabilita
	const [isJoining, setIsJoining] = useState(false);
	// Variable para guardar el error si la API falla
	const [joinError, setJoinError] = useState<string | null>(null);

	// Función que llama el componente ExcursionCard cuando el usuario hace click en el botón para apuntarse a la excursión
	const handleJoin = async (id: string | number) => {
		// Protección contra un doble click. Si isJoining ya es true, se sale inmediatamente para evitar llamar a la API dos veces.
		if (isJoining) return;
		// Se activa el estado de carga (el botón muestra el spinner).
		setIsJoining(true);
		// Se limpia cualquier error previo para empezar desde cero.
		setJoinError(null);
		// Se inicia este bloque para capturar cualquier error de red o servidor
		try {
			await onJoin(id);
			// El éxito es manejado por el componente padre, que actualizará `isJoined`.
		} catch (error: unknown) {
			// El error técnico ya se loguea en el componente consumidor (p. ej., ExcursionsList.tsx).
			// Aquí solo nos encargamos de capturar el mensaje para la UI.
			setJoinError(getSafeErrorMessage(error));
		} finally {
			// Aseguramos que el spinner se detenga siempre, tanto si hay éxito como si hay error.
			// Esto hace la UI más robusta por si el diseño cambia y el botón no se desmonta inmediatamente.
			setIsJoining(false);
		}
	};
	// Función para eliminar el error manualmente, es útil si se quiere poner una X en la alerta de error para cerrarla.
	const clearError = () => setJoinError(null);

	return { isJoining, joinError, handleJoin, clearError };
};
