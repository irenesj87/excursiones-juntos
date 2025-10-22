import React from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FiltersList from "../FiltersList";
import { clearAllFilters } from "../../slices/filterSlice";
import { FiMapPin, FiBarChart, FiClock, FiTrash2 } from "react-icons/fi";
import styles from "./Filters.module.css";

/** @typedef {import('../../types').RootState} RootState */

// Definimos las secciones de filtros con sus nombres, títulos e iconos.
const filterSections = [
	{
		name: "area",
		title: "Zona",
		Icon: FiMapPin,
	},
	{
		name: "difficulty",
		title: "Dificultad",
		Icon: FiBarChart,
	},
	{
		name: "time",
		title: "Tiempo estimado",
		Icon: FiClock,
	},
];

/**
 * @typedef {object} FiltersProps
 * @property {boolean} [showTitle=true] - Controla si se muestra el título o no.
 */

/**
 * Componente principal de los filtros que renderiza el tipo de los filtros de búsqueda (zona, dificultad, tiempo estimado).
 * @param {FiltersProps} props - Propiedades del componente.
 * @returns {React.ReactElement} - El componente de filtros.
 */
function Filters({ showTitle = true }) {
	const dispatch = useDispatch();
	/**
	 * Comprueba si hay algún filtro activo para habilitar/deshabilitar el botón de limpiar filtros.
	 * @type {boolean}
	 */
	const hasActiveFilters = useSelector(
		/**
		 * @param {RootState} state - El estado global de Redux.
		 * @returns {boolean} - Verdadero si hay algún filtro activo, falso en caso contrario.
		 */
		(state) =>
			state.filterReducer.area.length > 0 ||
			state.filterReducer.difficulty.length > 0 ||
			state.filterReducer.time.length > 0
	);

	/**
	 * Maneja el evento de click para limpiar todos los filtros.
	 * @returns {void}
	 */
	const handleClearFilters = () => {
		if (hasActiveFilters) {
			dispatch(clearAllFilters());
		}
	};

	return (
		// Contenedor principal de los filtros
		<div className={`${styles.filtersContainer} h-100 d-flex flex-column`}>
			{/* Contenedor para el contenido que puede hacer scroll */}
			<div className={styles.scrollableContent}>
				{showTitle && <h2 className={styles.title}>Filtros</h2>}
				{filterSections.map(({ name, title, Icon }) => (
					<section
						key={name}
						className={styles.filterSection}
						aria-labelledby={`filter-title-${name}`}
					>
						<h3 id={`filter-title-${name}`} className={styles.filterTitle}>
							<Icon className={styles.filterIcon} aria-hidden="true" /> {title}
						</h3>
						<FiltersList filterName={name} />
					</section>
				))}
			</div>
			{/* El footer se mantiene en la parte inferior */}
			<footer className={styles.filtersFooter}>
				<Button
					variant={hasActiveFilters ? "danger" : "secondary"}
					onClick={handleClearFilters}
					className="w-100 d-flex align-items-center justify-content-center"
					aria-label="Limpiar todos los filtros"
					disabled={!hasActiveFilters}
				>
					<FiTrash2 aria-hidden="true" className="me-2" />
					<span>Limpiar Filtros</span>
				</Button>
			</footer>
		</div>
	);
}

export default Filters;
