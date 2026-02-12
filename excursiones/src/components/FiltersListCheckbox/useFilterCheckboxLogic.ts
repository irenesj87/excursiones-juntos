import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toggleFilter } from "../../slices/filterSlice";
import type { FilterState } from "../../slices/filterSlice";

// Hook personalizado que encapsula la lógica de negocio del checkbox de filtro.
export function useFilterCheckboxLogic(
	filterName: keyof FilterState,
	filterValue: string,
) {
	const dispatch = useDispatch();

	const isChecked = useSelector((state: RootState) =>
		state.filterReducer[filterName].includes(filterValue),
	);

	const handleToggle = () => {
		dispatch(toggleFilter({ filterType: filterName, value: filterValue }));
	};

	return { isChecked, handleToggle };
}
