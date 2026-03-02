import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toggleFilter } from "../../slices/filterSlice";
import type { FilterState } from "../../slices/filterSlice";

/**
 * Hook personalizado que encapsula la lógica de negocio para un checkbox de filtro.
 * Gestiona el estado de selección (si está marcado o no) y proporciona una función
 * para despachar la acción de cambio de estado a Redux.
 * @param filterName - El nombre de la categoría de filtro (ej. 'area', 'difficulty').
 * @param filterValue - El valor específico del filtro dentro de la categoría (ej. 'Centro', 'Baja').
 * @returns Un objeto que contiene el estado `isChecked` y la función `handleToggle`.
 */
export function useFilterCheckboxLogic(
	filterName: keyof FilterState,
	filterValue: string,
) {
	const dispatch = useDispatch();

	/** Determina si el checkbox está actualmente seleccionado, basándose en el estado de Redux. */
	const isChecked = useSelector((state: RootState) =>
		state.filterReducer[filterName].includes(filterValue),
	);

	/** Despacha la acción para añadir o eliminar el filtro del estado global. */
	const handleToggle = () => {
		dispatch(toggleFilter({ filterType: filterName, value: filterValue }));
	};

	return { isChecked, handleToggle };
}
