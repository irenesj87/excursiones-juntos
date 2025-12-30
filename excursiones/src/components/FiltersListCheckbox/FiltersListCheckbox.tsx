import React, { useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toggleFilter } from "../../slices/filterSlice";
import cn from "classnames";
import styles from "./FiltersListCheckbox.module.css";
import type { FilterState } from "../../slices/filterSlice";

interface FiltersListCheckboxProps {
	readonly filterName: keyof FilterState; // Por ejemplo: 'area', 'difficulty', 'time'
	readonly filter: string; // El valor específico del filtro, por ejemplo: 'Montaña', 'Baja'
}

interface LabelProps {
	readonly htmlFor: string;
	readonly filter: string;
	readonly isChecked: boolean;
}

// Componente interno para la etiqueta del filtro (unificado).
function FilterLabel({ htmlFor, filter, isChecked }: LabelProps) {
	return (
		<label
			htmlFor={htmlFor}
			className={cn(styles.filterPill, {
				[styles.checked]: isChecked,
			})}
		>
			{filter}
		</label>
	);
}

function FiltersListCheckbox({ filterName, filter }: FiltersListCheckboxProps) {
	const dispatch = useDispatch();

	// Obtenemos los filtros seleccionados para esta categoría (ej. 'area') desde Redux
	const selectedFilters = useSelector(
		(state: RootState) => state.filterReducer[filterName]
	);

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
			<FilterLabel htmlFor={id} filter={filter} isChecked={isChecked} />
		</>
	);
}

export default FiltersListCheckbox;
