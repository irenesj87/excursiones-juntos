import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

/**
 * Hook personalizado para manejar la lógica de la página de excursiones.
 * Gestiona la visibilidad de los filtros en breakpoints pequeños y el conteo de filtros activos.
 */
export function useExcursionsPageLogic() {
	const [showFilters, setShowFilters] = useState(false);

	const handleCloseFilters = () => setShowFilters(false);
	const handleShowFilters = () => setShowFilters(true);

	const activeFilterCount = useSelector((state: RootState) => {
		const { area, difficulty, time } = state.filterReducer;
		return area.length + difficulty.length + time.length;
	});

	const filterCountText =
		activeFilterCount === 1 ? "seleccionado" : "seleccionados";

	const ariaFilterLabel = `Mostrar filtros. ${activeFilterCount} ${
		activeFilterCount === 1 ? "filtro aplicado" : "filtros aplicados"
	}.`;

	return {
		showFilters,
		handleCloseFilters,
		handleShowFilters,
		activeFilterCount,
		filterCountText,
		ariaFilterLabel,
	};
}
