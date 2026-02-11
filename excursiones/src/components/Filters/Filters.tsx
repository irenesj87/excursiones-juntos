import React from "react";
import FiltersList from "../FiltersList";
import { ChartIcon, ClockIcon, MapIcon, FilterXIcon } from "../../ui/Icons";
import styles from "./Filters.module.css";
import StyledButton from "../../ui/CustomButton/CustomButton";
import { useFiltersLogic } from "./useFiltersLogic";

/**
 * Props para el componente `Filters`.
 */
interface FiltersProps {
	/**
	 * Si es `true`, muestra el título principal "Filtros".
	 * @default true
	 */
	readonly showTitle?: boolean;
}

/** Tipo para los nombres de las categorías de filtro. */
type FilterName = "area" | "difficulty" | "time";

type FilterSection = {
	name: FilterName;
	title: string;
	icon: React.ReactNode;
};

/** Define las secciones de filtros con sus nombres, títulos e iconos correspondientes. */
const filterSections = [
	{
		name: "area",
		title: "Zona",
		icon: <MapIcon className={styles.filterIcon} />,
	},
	{
		name: "difficulty",
		title: "Dificultad",
		icon: <ChartIcon className={styles.filterIcon} />,
	},
	{
		name: "time",
		title: "Tiempo Estimado",
		icon: <ClockIcon className={styles.filterIcon} />,
	},
] satisfies FilterSection[];

/**
 * Componente que renderiza el panel de filtros.
 * Muestra diferentes secciones de filtrado (zona, dificultad, tiempo) y un botón para limpiar todas las selecciones.
 * @param props - Las props del componente.
 * @returns - El componente de filtros.
 */
function Filters({ showTitle = true }: FiltersProps) {
	const { hasActiveFilters, handleClearFilters } = useFiltersLogic();

	return (
		<div className={styles.filtersContainer}>
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
				<StyledButton
					variant={hasActiveFilters ? "danger" : "secondary"}
					onClick={handleClearFilters}
					className={styles.clearButton}
					disabled={!hasActiveFilters}
				>
					<span className={styles.buttonContent}>
						<FilterXIcon className={styles.filterIcon} />
						Limpiar Filtros
					</span>
				</StyledButton>
			</footer>
		</div>
	);
}

export default Filters;
