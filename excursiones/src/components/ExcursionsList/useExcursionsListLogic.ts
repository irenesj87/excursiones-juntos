import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Excursion } from "../../types";
import { useJoinExcursionAction } from "./useJoinExcursionAction";

const JOIN_EXCURSION_ERROR_MSG =
	"No ha sido posible apuntarse a la excursión. Por favor, inténtalo de nuevo más tarde.";

/**
 * Hook personalizado para detectar si una media query de CSS coincide.
 * @param query La media query a evaluar (ej: '(min-width: 768px)').
 * @returns `true` si la media query coincide, `false` en caso contrario.
 */
function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(() => {
		if (globalThis.window === undefined) return false;
		return globalThis.window.matchMedia(query).matches;
	});

	useEffect(() => {
		if (globalThis.window === undefined) return;

		const mediaQueryList = globalThis.window.matchMedia(query);
		const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

		mediaQueryList.addEventListener("change", listener);
		return () => mediaQueryList.removeEventListener("change", listener);
	}, [query]);

	return matches;
}

/**
 * Define qué datos recibe el hook desde el componente padre (datos crudos, estado de carga).
 */
export interface ExcursionsListProps {
	readonly excursionData?: readonly Excursion[];
	readonly isLoading: boolean;
	readonly error: Error | null;
}

/**
 * Datos que se retornan al componente visual.
 */
export interface ExcursionsListViewProps {
	readonly excursions: readonly Excursion[];
	readonly isLoading: boolean;
	readonly error: Error | null;
	readonly isLoggedIn: boolean;
	readonly joinedExcursionIds: ReadonlySet<string>;
	readonly onJoin: (id: string | number) => Promise<void>;
	readonly currentPage: number;
	readonly totalPages: number;
	readonly onPageChange: (page: number) => void;
}

/**
 * Custom hook que actúa como el cerebro del listado de excursiones.
 * Su objetivo principal es separar la lógica de negocio de la interfaz visual.
 * Es el intermediario (controller) entre los datos crudos que vienen del padre (ExcursionsListProps) y lo que la UI
 * necesita para renderizar (ExcursionsListViewProps).
 * Además, integra la lógica de negocio para apuntarse a una excursión, utilizando otro hook especializado
 * (useJoinExcursionAction).
 */
export function useExcursionsListLogic({
	excursionData = [],
	isLoading,
	error,
}: ExcursionsListProps): ExcursionsListViewProps {
	// Se accede a Redux para saber si el usuario está logueado o no.
	const { login: isLoggedIn, user } = useSelector(
		(state: RootState) => state.loginReducer,
	);
	// Se obtiene la función joinExcursion de otro hook.
	const { joinExcursion } = useJoinExcursionAction();

	// Mantenemos los resultados antiguos visibles mientras cargan los nuevos para evitar parpadeos (UX).
	// Si simplemente se pasara excursionData, cuando el usuario refresca la vista, la pantalla podría parpadear,
	// borrando lo que ya estaba viendo.
	// Con el estado local displayedExcursions, se congela la lista antigua en pantalla mientras isLoading sea true.
	// Solo cuando la carga termina, se actualiza la lista con los datos nuevos.
	const [displayedExcursions, setDisplayedExcursions] =
		useState<readonly Excursion[]>(excursionData);

	// --- Lógica de Paginación ---
	const [currentPage, setCurrentPage] = useState(1);
	const isDesktop = useMediaQuery("(min-width: 992px)"); // Breakpoint 'lg' de Bootstrap
	const ITEMS_PER_PAGE = isDesktop ? 8 : 4;

	// Se calcula sobre la lista que se está mostrando para ser consistente con la UI.
	const totalPages = Math.ceil(displayedExcursions.length / ITEMS_PER_PAGE);

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginatedExcursions = displayedExcursions.slice(
		startIndex,
		startIndex + ITEMS_PER_PAGE,
	);

	// --- Fin Lógica de Paginación ---

	useEffect(() => {
		if (!isLoading) {
			setDisplayedExcursions(excursionData);
			// Si los datos cambian (ej: por un filtro), volvemos a la página 1.
			setCurrentPage(1);
		}
	}, [isLoading, excursionData]);

	// Transformación a Set para búsquedas O(1) en el renderizado.
	// Toma la lista de excursiones a las que se ha apuntado el usuario(si existe), convierte todos los IDs a texto
	// para evitar errores de comparación y luego los guarda en un Set para para que cuando el componente visual
	// dibuje la lista y tenga que preguntar "¿el usuario se ha apuntado a esta excursión?" para cada tarjeta pueda
	// responder instantáneamente ya que la complejidad del Set es O(1) y no tenga que recorrer una array cuya
	// complejidad es O(n).
	const joinedExcursionIds = new Set((user?.excursions || []).map(String));

	// Función que la UI llamará cuando el usuario quiera apuntarse a una excursión. Si falla el intento de apuntarse
	// a una excursión, captura el error técnico, lo loguea para los desarrolladores y luego lanza un error genérico
	// con un mensaje amigable para que la UI lo muestre al usuario, sin exponer detalles técnicos.
	const handleJoinExcursion = async (excursionId: string | number) => {
		try {
			await joinExcursion(excursionId);
		} catch (caughtError: unknown) {
			if (process.env.NODE_ENV === "development") {
				console.error("Error detallado (dev):", caughtError);
			} else {
				console.error("Error técnico al unirse a la excursión:", caughtError);
			}
			// Relanzamos un error genérico para que la UI pueda mostrar un mensaje amigable
			// sin exponer detalles de la implementación.
			throw new Error(JOIN_EXCURSION_ERROR_MSG);
		}
	};

	return {
		excursions: paginatedExcursions,
		// Indica si se están cargando excursiones. La UI utilizará este boolean para mostrar un estado de carga,
		// en este caso, un skeleton.
		isLoading,
		error,
		isLoggedIn,
		// Set que contiene los ID de las excursiones a las que el usuario actual se ha apuntado.
		joinedExcursionIds,
		// Función que la UI debe llamar cuando el usuario quiere unierse a una excursión.
		// handleJoinExcursion, envuelve la lógica de joinExcursion(que viene de otro hook), gestiona los errores y se
		// los comunica a la UI.
		onJoin: handleJoinExcursion,
		currentPage,
		totalPages,
		onPageChange: setCurrentPage,
	};
}
