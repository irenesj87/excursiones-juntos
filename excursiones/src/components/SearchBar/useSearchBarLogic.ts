import { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { searchExcursions } from "../../services/excursionService";
import { RootState } from "../../store/store";
import { Excursion } from "../../types";

const DEBOUNCE_DELAY_MS = 500;

// Constantes para mensajes de error (Regla 2: Sustituir literales)
const ERR_CONNECTION_TITLE = "Error de conexión";
const ERR_CONNECTION_MSG =
	"No se pudo conectar con el servidor. Revisa tu conexión.";
const ERR_FETCH_TITLE = "Error al buscar";
const ERR_FETCH_MSG =
	"No se han podido cargar las excursiones. Inténtalo de nuevo más tarde.";
/** Mensaje nativo que devuelven los navegadores ante errores de red. */
const MENSAJE_ERROR_RED_NATIVO = "Failed to fetch";

interface UseSearchBarLogicProps {
	searchValue: string;
	onFetchSuccess: (excursions: readonly Excursion[]) => void;
	onExcursionsFetchStart: () => void;
	onExcursionsFetchEnd: (
		error: (Error & { secondaryMessage?: string }) | null,
	) => void;
}

/**
 * Genera un error amigable para el usuario basado en el error técnico capturado.
 */
function createFriendlyError(
	error: unknown,
): Error & { secondaryMessage?: string } {
	if (
		error instanceof TypeError &&
		error.message === MENSAJE_ERROR_RED_NATIVO
	) {
		const err: Error & { secondaryMessage?: string } = new Error(
			ERR_CONNECTION_TITLE,
		);
		err.secondaryMessage = ERR_CONNECTION_MSG;
		return err;
	}
	const err: Error & { secondaryMessage?: string } = new Error(ERR_FETCH_TITLE);
	err.secondaryMessage = ERR_FETCH_MSG;
	return err;
}

/**
 * Hook que encapsula la lógica de búsqueda, debounce y sincronización con el servicio de excursiones.
 */
export function useSearchBarLogic({
	searchValue,
	onFetchSuccess,
	onExcursionsFetchStart,
	onExcursionsFetchEnd,
}: UseSearchBarLogicProps) {
	const [debouncedSearch, setDebouncedSearch] = useState(searchValue);
	const [error, setError] = useState<
		(Error & { secondaryMessage?: string }) | null
	>(null);

	const { area, difficulty, time } = useSelector(
		(state: RootState) => state.filterReducer,
		shallowEqual,
	);

	// Refs para estabilidad referencial de callbacks de props (Regla 1 de GEMINI.md)
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
		const timerId = setTimeout(() => {
			setDebouncedSearch(searchValue);
		}, DEBOUNCE_DELAY_MS);

		return () => clearTimeout(timerId);
	}, [searchValue]);

	// Petición de datos
	useEffect(() => {
		const fetchData = async () => {
			onExcursionsFetchStartRef.current();
			try {
				const data = await searchExcursions({
					debouncedSearch,
					area,
					difficulty,
					time,
				});
				onFetchSuccessRef.current(data);
				setError(null);
				onExcursionsFetchEndRef.current(null);
			} catch (err) {
				console.error("Error técnico al buscar excursiones:", err);
				const friendlyError = createFriendlyError(err);
				onFetchSuccessRef.current([]);
				setError(friendlyError);
				onExcursionsFetchEndRef.current(friendlyError);
			}
		};

		fetchData();
	}, [debouncedSearch, area, difficulty, time]);

	const clearError = () => {
		setError(null);
	};

	return {
		debouncedSearch,
		error,
		clearError,
	};
}
