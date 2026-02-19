import React from "react";
import { useDispatch } from "react-redux";
import { FiltersList } from "../FiltersList";
import { ChartIcon, ClockIcon, MapIcon, XIcon } from "../../ui/Icons";
import { clearAllFilters } from "../../slices/filterSlice";
import styles from "./Filters.module.css";

const TEXTS = {
	TITLE: "Afina tu búsqueda",
} as const;

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
		title: "Tiempo estimado",
		icon: <ClockIcon className={styles.filterIcon} />,
	},
] satisfies FilterSection[];

/**
 * Componente que renderiza una barra de filtros horizontal.
 * Agrupa los filtros por categoría y permite limpiar todas las selecciones.
 */
export function Filters() {
	const dispatch = useDispatch();

	const handleClearFilters = () => {
		// Asume que tienes una acción `clearAllFilters` en tu slice de filtros.
		dispatch(clearAllFilters());
	};

	return (
		<section className={styles.filtersSection} aria-labelledby="filters-title">
			<h2 id="filters-title" className={styles.sectionTitle}>
				{TEXTS.TITLE}
			</h2>
			<div className={styles.filtersContainer}>
				<div className={styles.filtersWrapper}>
					<div className={styles.filterGroup}>
						{filterSections
							.slice(0, 2)
							.map(({ name, title, icon }) =>
								renderFilterSection(name, title, icon),
							)}
					</div>

					<div className={styles.filterGroup}>
						{filterSections
							.slice(2)
							.map(({ name, title, icon }) =>
								renderFilterSection(name, title, icon),
							)}
					</div>
				</div>
				<button onClick={handleClearFilters} className={styles.clearButton}>
					<XIcon size={16} />
					Limpiar filtros
				</button>
			</div>
		</section>
	);

	function renderFilterSection(
		name: FilterName,
		title: string,
		icon: React.ReactNode,
	) {
		return (
			<div key={name} className={styles.filterGroup}>
				<h3 className={styles.filterTitle}>
					{icon}
					<span>{title}</span>
				</h3>
				<span className={styles.filterListContainer}>
					<FiltersList filterName={name} />
				</span>
			</div>
		);
	}
}
