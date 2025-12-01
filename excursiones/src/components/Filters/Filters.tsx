import React from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FiltersList from "../FiltersList";
import { clearAllFilters } from "../../slices/filterSlice";
import { FiMapPin, FiTrash2 } from "react-icons/fi";
import { BsBarChartFill } from "react-icons/bs";
import { FaRegClock } from "react-icons/fa";
import styles from "./Filters.module.css";
import { RootState } from "../../store/store";

// Asignamos el icono a una constante con el tipo React.ElementType para asegurar a TypeScript que es un componente JSX válido.
const MapIcon = FiMapPin as React.ComponentType<{
	className: string;
}>;

// Asignamos el icono a una constante con el tipo React.ElementType para asegurar a TypeScript que es un componente JSX válido.
const ChartIcon = BsBarChartFill as React.ComponentType<{
	className: string;
}>;

const ClockIcon = FaRegClock as React.ComponentType<{
	className: string;
}>;

const TrashIcon = FiTrash2 as React.ComponentType<{
	className: string;
}>;

// Definimos las props que puede recibir el componente Filters.
interface FiltersProps {
	showTitle?: boolean;
}

// Definimos el tipo para las secciones de filtros.
type FilterName = "area" | "difficulty" | "time";

type FilterSection = {
	name: FilterName;
	title: string;
	icon: React.ReactNode;
};

// Definimos las secciones de filtros con sus nombres, títulos e iconos.
const filterSections = [
	{
		name: "area",
		title: "Zona",
		icon: <MapIcon className={styles.icon} />,
	},
	{
		name: "difficulty",
		title: "Dificultad",
		icon: <ChartIcon className={styles.icon} />,
	},
	{
		name: "time",
		title: "Tiempo estimado",
		icon: <ClockIcon className={styles.icon} />,
	},
] satisfies FilterSection[];

/**
 * Componente principal de los filtros que renderiza el tipo de los filtros de búsqueda (zona, dificultad, tiempo estimado).
 */
const Filters = ({ showTitle = true }: FiltersProps) => {
	const dispatch = useDispatch();
	/**
	 * Comprueba si hay algún filtro activo para habilitar/deshabilitar el botón de limpiar filtros.
	 */
	const hasActiveFilters = useSelector(
		(state: RootState) =>
			state.filterReducer.area.length > 0 ||
			state.filterReducer.difficulty.length > 0 ||
			state.filterReducer.time.length > 0
	);

	/**
	 * Maneja el evento de click para limpiar todos los filtros.
	 */
	const handleClearFilters = () => {
		if (hasActiveFilters) {
			dispatch(clearAllFilters());
		}
	};

	// Renderizamos el componente de filtros con su contenido y el botón de limpiar filtros en el footer.
	return (
		<div className={`${styles.filtersContainer} h-100 d-flex flex-column`}>
			{/* Contenedor para el contenido que puede hacer scroll */}
			<div className={styles.scrollableContent}>
				{showTitle && <h2 className={styles.title}>Filtros</h2>}
				{filterSections.map(({ name, title, icon }) => (
					<section
						key={name}
						className={styles.filterSection}
						aria-labelledby={`filter-title-${name}`}
					>
						<h3 id={`filter-title-${name}`} className={styles.filterTitle}>
							{icon}
							{title}
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
					<TrashIcon className={styles.icon} />
					<span className="ms-2">Limpiar Filtros</span>
				</Button>
			</footer>
		</div>
	);
};

export default Filters;
