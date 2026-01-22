import { useDispatch, useSelector } from "react-redux";
import { clearAllFilters } from "../../slices/filterSlice";
import { RootState } from "../../store/store";

/**
 * Selector para verificar si existen filtros activos en el estado global.
 */
export const selectHasActiveFilters = (state: RootState) => {
	const { area, difficulty, time } = state.filterReducer;
	return area.length > 0 || difficulty.length > 0 || time.length > 0;
};

/**
 * Hook personalizado para encapsular la lógica de estado y acciones de los filtros.
 */
export function useFiltersLogic() {
	const dispatch = useDispatch();

	const hasActiveFilters = useSelector(selectHasActiveFilters);

	// Función para evento onClick del botón en la UI.
	const handleClearFilters = () => {
		// Si hay algún filtro activo...
		if (hasActiveFilters) {
			// ...se manda a la store que limpie los arrays
			dispatch(clearAllFilters());
		}
	};

	// Se retorna un objeto con el estado del botón para saber si hay que ponerle como habilitado o deshabilitado
	// y la función para ejecutar la acción.
	return { hasActiveFilters, handleClearFilters };
}
