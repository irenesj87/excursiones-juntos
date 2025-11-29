import React, { useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toggleFilter } from "../../slices/filterSlice";
import cn from "classnames";
import styles from "./FiltersListCheckbox.module.css";

import type { FilterState } from "../../slices/filterSlice";

interface FiltersListCheckboxProps {
	filterName: keyof FilterState; // Por ejemplo: 'area', 'difficulty', 'time'
	filter: string; // El valor específico del filtro, por ejemplo: 'Montaña', 'Baja'
}

interface LabelProps {
	htmlFor: string;
	filter: string;
	isChecked: boolean;
}

// Componente interno para la etiqueta que usa el hook de dificultad.
const DifficultyLabel = ({ htmlFor, filter, isChecked }: LabelProps) => {
	// Obtenemos el nombre de la clase en minúsculas para usarlo como selector.
	// Por ejemplo: "Baja" -> "baja".
	const difficultyClassName = filter.toLowerCase();

	return (
		<label
			htmlFor={htmlFor}
			className={cn(styles.filterPill, {
				[styles[difficultyClassName]]: !isChecked, // Ej: styles.baja, styles.media
				[styles[`${difficultyClassName}Checked`]]: isChecked, // Ej: styles.bajaChecked
			})}
		>
			{filter}
		</label>
	);
};

// Componente interno para la etiqueta genérica.
const GenericLabel = ({ htmlFor, filter, isChecked }: LabelProps) => (
	<label
		htmlFor={htmlFor}
		className={cn(styles.filterPill, {
			[styles.checked]: isChecked,
		})}
	>
		{filter}
	</label>
);

const FiltersListCheckbox = ({
	filterName,
	filter,
}: FiltersListCheckboxProps) => {
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
			{filterName === "difficulty" ? (
				<DifficultyLabel
					htmlFor={id}
					filter={filter}
					isChecked={isChecked} // 'filterName' eliminado
				/>
			) : (
				<GenericLabel htmlFor={id} filter={filter} isChecked={isChecked} /> // 'filterName' eliminado
			)}
		</>
	);
};

export default FiltersListCheckbox;
