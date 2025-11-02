import React, { useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFilter } from "../../slices/filterSlice";
import cn from "classnames";
import styles from "./FiltersListCheckbox.module.css";

/** @typedef {import("../../types").RootState} RootState */

/**
 * @typedef {object} FiltersListCheckboxProps - Props del componente FiltersListCheckbox.
 * @property {string} filterName - El nombre de la categoría de filtro (ej. "area").
 * @property {string} filter - El valor específico del filtro (ej. "Picos de Europa").
 */

/**
 * Componente que renderiza una única opción de filtro como una píldora interactiva.
 * @param {FiltersListCheckboxProps} props - Propiedades del componente.
 * @returns {React.ReactElement} - El componente de filtro individual.
 */
function FiltersListCheckbox({ filterName, filter }) {
	const dispatch = useDispatch();

	// Obtenemos los filtros seleccionados para esta categoría (ej. 'area') desde Redux
	const selectedFilters = useSelector(
		/**
		 * @param {RootState} state - El estado global de Redux.
		 * @returns {string[]} - Array de filtros seleccionados para la categoría dada.
		 */
		(state) => state.filterReducer[filterName]
	);

	// El filtro está seleccionado si su valor está incluido en el array del estado de Redux
	const isChecked = selectedFilters.includes(filter);

	/**
	 * Maneja el evento de cambio del checkbox.
	 * Despacha la acción `toggleFilter` para añadir o quitar el filtro del estado de Redux.
	 * @returns {void}
	 */
	const handleToggle = () => {
		dispatch(toggleFilter({ filterType: filterName, value: filter }));
	};

	/**
	 * Genera un ID único para el checkbox y su etiqueta asociada.
	 */
	const id = useId();

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
}

export default FiltersListCheckbox;
