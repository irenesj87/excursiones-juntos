import { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { searchExcursions } from "../../services/excursionService";
import { RootState } from "../../store/store";
import { Excursion } from "../../types";

/**
 * Constante que define el tiempo de espera para el debounce en milisegundos. 
 * Esto determina cuánto tiempo debe esperar el sistema después de que el usuario deje de escribir 
 * antes de ejecutar la búsqueda. 
 * Un valor común es 500ms, lo que proporciona un equilibrio entre reactividad y reducción de llamadas innecesarias 
 * al servidor para evitar saturarlo.
 */
const DEBOUNCE_DELAY_MS = 500;

// Constantes para mensajes de error
const ERR_CONNECTION_TITLE = "Error de conexión";
const ERR_CONNECTION_MSG =
	"No se pudo conectar con el servidor. Por favor, revisa tu conexión.";
const ERR_FETCH_TITLE = "Error al buscar";
const ERR_FETCH_MSG =
	"No se han podido cargar las excursiones. Inténtalo de nuevo más tarde.";
/** Mensaje nativo que retornan los navegadores ante errores de red. */
const MENSAJE_ERROR_RED_NATIVO = "Failed to fetch";

/** Array vacío que representa el resultado cuando no hay excursiones disponibles. */
const EMPTY_EXCURSIONS: readonly Excursion[] = [];

/**
 * Interfaz que extiende el Error estándar para incluir un mensaje secundario amigable.
 */
export interface SearchError extends Error {
	secondaryMessage?: string;
}

/**
 * Propiedades para el hook useSearchBarLogic.
 */
interface UseSearchBarLogicProps {
	/** Valor actual del input de búsqueda. */
	searchValue: string;
	/** Callback ejecutado cuando la búsqueda tiene éxito. */
	onFetchSuccess: (excursions: readonly Excursion[]) => void;
	/** Callback ejecutado al iniciar la petición. */
	onExcursionsFetchStart: () => void;
	/** Callback ejecutado al finalizar la petición (éxito o error). */
	onExcursionsFetchEnd: (error: SearchError | null) => void;
}

/**
 * Genera un error amigable para el usuario basado en el error técnico capturado.
 *
 * @param error - El error capturado en el bloque try/catch.
 * @returns Un objeto SearchError con mensajes localizados y amigables.
 */
function createFriendlyError(error: unknown): SearchError {
	if (
		error instanceof TypeError &&
		error.message === MENSAJE_ERROR_RED_NATIVO
	) {
		const err: SearchError = new Error(ERR_CONNECTION_TITLE);
		err.secondaryMessage = ERR_CONNECTION_MSG;
		return err;
	}
	const err: SearchError = new Error(ERR_FETCH_TITLE);
	err.secondaryMessage = ERR_FETCH_MSG;
	return err;
}

/**
 * Hook que encapsula la lógica de búsqueda, debounce y sincronización con el servicio de excursiones.
 *
 * @param props - Propiedades de configuración y callbacks.
 * @returns Objeto con el estado de error y función para limpiarlo.
 */
export function useSearchBarLogic({
	searchValue,
	onFetchSuccess,
	onExcursionsFetchStart,
	onExcursionsFetchEnd,
}: UseSearchBarLogicProps) {
	const [debouncedSearch, setDebouncedSearch] = useState(searchValue);
	const [error, setError] = useState<SearchError | null>(null);

	// Selección de filtros desde el estado global de Redux. 
	// Se utiliza shallowEqual para evitar re-renderizados innecesarios si los filtros no cambian.
	const { area, difficulty, time } = useSelector(
		(state: RootState) => state.filterReducer,
		shallowEqual,
	);

	// Refs para estabilidad referencial de callbacks de props. 
	// Esto es importante para evitar que el efecto de búsqueda se dispare innecesariamente debido a cambios en 
	// las referencias de las funciones pasadas desde el componente padre. Se evitan bucles de peticiones infinitas.
	const onFetchSuccessRef = useRef(onFetchSuccess);
	const onExcursionsFetchStartRef = useRef(onExcursionsFetchStart);
	const onExcursionsFetchEndRef = useRef(onExcursionsFetchEnd);

	useEffect(() => {
		onFetchSuccessRef.current = onFetchSuccess;
		onExcursionsFetchStartRef.current = onExcursionsFetchStart;
		onExcursionsFetchEndRef.current = onExcursionsFetchEnd;
	}, [onFetchSuccess, onExcursionsFetchStart, onExcursionsFetchEnd]);

	// Manejo del Debounce
	useEffect(() => {
		// Cada vez que el valor de búsqueda cambia, se establece un temporizador para actualizar 
		// el estado `debouncedSearch` después de un retraso definido por DEBOUNCE_DELAY_MS. 
		// Si el usuario sigue escribiendo antes de que el temporizador se complete, el temporizador anterior 
		// se cancela y se reinicia, lo que evita que la búsqueda se ejecute con cada pulsación de tecla y 
		// reduce la carga en el servidor.
		const timerId = setTimeout(() => {
			setDebouncedSearch(searchValue);
		}, DEBOUNCE_DELAY_MS);

		return () => clearTimeout(timerId);
	}, [searchValue]);

	/**
	 * Efecto que se ejecuta cada vez que cambian los filtros o el valor de búsqueda debounced.
	 * Realiza la llamada al servicio de búsqueda de excursiones y maneja los estados de carga, éxito y error.
	 * Se asegura de que la búsqueda se ejecute solo cuando el usuario ha dejado de escribir por un tiempo 
	 * y cuando los filtros han cambiado, evitando así llamadas innecesarias al servidor.
	 */
	useEffect(() => {
		const fetchData = async () => {
			// Notificamos al componente padre que la búsqueda ha comenzado.
			onExcursionsFetchStartRef.current();
			// Realizamos la llamada al servicio de búsqueda con los parámetros actuales.
			try {
				const data = await searchExcursions({
					debouncedSearch,
					area,
					difficulty,
					time,
				});
				// Si la búsqueda es exitosa, notificamos al componente padre con los datos obtenidos, se actualiza 
				// la UI con los resultados y limpiamos cualquier error previo.
				onFetchSuccessRef.current(data);
				setError(null);
				onExcursionsFetchEndRef.current(null);
			// Si ocurre un error durante la búsqueda, lo capturamos, generamos un error amigable para el usuario, 
			// notificamos al componente padre y actualizamos el estado de error local.	
			} catch (err) {
				console.error("Error técnico al buscar excursiones:", err);
				const friendlyError = createFriendlyError(err);
				onFetchSuccessRef.current(EMPTY_EXCURSIONS);
				setError(friendlyError);
				onExcursionsFetchEndRef.current(friendlyError);
			}
		};

		fetchData();
	}, [debouncedSearch, area, difficulty, time]);

	/**
	 * Limpia el estado de error actual.
	 */
	const clearError = () => {
		setError(null);
	};

	return {
		error,
		clearError,
	};
}
