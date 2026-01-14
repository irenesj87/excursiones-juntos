import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Excursion } from "../../types";
import { useJoinExcursionAction } from "./useJoinExcursionAction";

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
}

/**
 * Este hook actúa como un intermediario inteligente, dando a la UI un conjunto de datos y funciones ya procesados
 * y listos para usar. 
 */
export function useExcursionsListLogic({
	excursionData = [],
	isLoading,
	error,
}: ExcursionsListProps): ExcursionsListViewProps {
    // se accede a Redux para saber si el usuario está logueado o no.
	const { login: isLoggedIn, user } = useSelector(
		(state: RootState) => state.loginReducer
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

	useEffect(() => {
		if (!isLoading) {
			setDisplayedExcursions(excursionData);
		}
	}, [isLoading, excursionData]);

    // Transformación a Set para búsquedas O(1) en el renderizado.
    // Toma la lista de excursiones del usuario(si existe), convierte todos los IDs a texto para evitar errores de
    // comparación y luego los guarda en un Set para ir más rápido.
	const joinedExcursionIds = new Set((user?.excursions || []).map(String));

	const handleJoinExcursion = async (excursionId: string | number) => {
		try {
			await joinExcursion(excursionId);
		} catch (caughtError: unknown) {
			if (process.env.NODE_ENV === "development") {
				console.error("Error detallado (dev):", caughtError);
			} else {
				const errorMessage = caughtError instanceof Error ? caughtError.message : "Error desconocido";
				console.error("Error técnico al unirse a la excursión:", errorMessage);
			}
			// Relanzamos un error genérico para que la UI pueda mostrar un mensaje amigable
			// sin exponer detalles de la implementación.
			throw new Error(
				"No ha sido posible apuntarse a la excursión. Por favor, inténtalo de nuevo más tarde."
			);
		}
	};

	return {
		excursions: displayedExcursions,
		// Indica si se están cargando excursiones. La UI utilizará este boolean para mostrar un estado de carga,
		// en este caso, en skeleton.
		isLoading,
		error,
		isLoggedIn,
		// Set que contiene los ID de las excursiones a las que el usuario actual se ha apuntado.
		joinedExcursionIds,
		// Función que la UI debe llamar cuando el usuario quiere unierse a una excursión.
		// handleJoinExcursion, envuelve la lógica de joinExcursion(que viene de otro hook), gestiona los errores y se
		// los comunica a la UI.
		onJoin: handleJoinExcursion,
	};
}
