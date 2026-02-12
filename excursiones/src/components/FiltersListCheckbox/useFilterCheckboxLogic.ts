import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toggleFilter } from "../../slices/filterSlice";
import type { FilterState } from "../../slices/filterSlice";

/**
 * Hook personalizado que encapsula la lógica de negocio del checkbox de filtro.
 * Separa la lógica de Redux de la UI (Regla 2).
 */
export function useFilterCheckboxLogic(
	filterName: keyof FilterState,
	filterValue: string,
) {
	const dispatch = useDispatch();

	// Optimización de Rendimiento (Regla 1):
	// Movemos la comprobación .includes dentro del selector.
	// Así, useSelector compara el booleano resultante y evita re-renders innecesarios
	// si el array cambia pero el estado de ESTE filtro específico sigue siendo el mismo.
	const isChecked = useSelector((state: RootState) =>
		state.filterReducer[filterName].includes(filterValue),
	);

	const handleToggle = () => {
		dispatch(toggleFilter({ filterType: filterName, value: filterValue }));
	};

	return { isChecked, handleToggle };
}
