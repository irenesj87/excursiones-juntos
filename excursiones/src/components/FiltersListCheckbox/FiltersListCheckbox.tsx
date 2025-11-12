import React, { useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFilter } from "../../slices/filterSlice";
import cn from "classnames";
import styles from "./FiltersListCheckbox.module.css";

interface FiltersListCheckboxProps {
	filterName: string;
	filter: string;
}

const FiltersListCheckbox = ({
	filterName,
	filter,
}: FiltersListCheckboxProps) => {
	const dispatch = useDispatch();

	// Obtenemos los filtros seleccionados para esta categoría (ej. 'area') desde Redux
	const selectedFilters = useSelector(
(state: { filterReducer: FilterState }) => state.filterReducer[filterName]

	// El filtro está seleccionado si su valor está incluido en el array del estado de Redux
	const isChecked = selectedFilters.includes(filter);

	/**
	 * Maneja el evento de cambio del checkbox.
	 */
	const handleToggle = () => {
		dispatch(toggleFilter({ filterType: filterName, value: filter }));
	};

	/**
	 * Genera un ID único para el checkbox y su etiqueta asociada.
	 */
	const id = useId();

	// Renderizamos el checkbox oculto y la etiqueta estilizada como un "pill".
	return (
		<>
			<input
				type="checkbox"
				id={id}
				name={filterName}
				value={filter}
				checked={isChecked}
				onChange={handleToggle}
				className={styles.visuallyHidden}
			/>
			<label
				htmlFor={id}
				className={cn(styles.filterPill, { [styles.checked]: isChecked })}
			>
				{filter}
			</label>
		</>
	);
};

export default FiltersListCheckbox;
