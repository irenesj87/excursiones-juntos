import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiltersList } from "../FiltersList";
import { ChartIcon, ClockIcon, MapIcon, XIcon } from "../../ui/Icons";
import { clearAllFilters } from "../../slices/filterSlice";
import styles from "./Filters.module.css";
import { RootState } from "../../store/store";

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
 * Renderiza una sección de filtro individual con su título, icono y lista de opciones.
 * Es una función pura fuera del componente para mejorar la legibilidad y la estabilidad referencial.
 *
 * @param name - El nombre de la categoría de filtro.
 * @param title - El título visible de la sección.
 * @param icon - El icono a mostrar junto al título.
 * @returns Un elemento JSX que representa la sección del filtro.
 */
function renderFilterSection(
	name: FilterName,
	title: string,
	icon: React.ReactNode,
) {
	return (
		<div key={name} className={styles.filterGroupContainer}>
			<h3 className={styles.filterTitle}>
				{icon}
				<span>{title}</span>
			</h3>
			<FiltersList filterName={name} />
		</div>
	);
}

/**
 * Componente que renderiza una barra de filtros horizontal.
 * Agrupa los filtros por categoría y permite limpiar todas las selecciones.
 */
export function Filters() {
	const dispatch = useDispatch();
	const isAnyFilterActive = useSelector((state: RootState) => {
		const { area, difficulty, time } = state.filterReducer;
		return area.length > 0 || difficulty.length > 0 || time.length > 0;
	});

	const handleClearFilters = () => {
		// Asume que tienes una acción `clearAllFilters` en tu slice de filtros.
		dispatch(clearAllFilters());
	};

	return (
		<div className={styles.filtersSection}>
			<div className={styles.filtersWrapper}>
				<div className={styles.filterGroups}>
					{filterSections.map(({ name, title, icon }) =>
						renderFilterSection(name, title, icon),
					)}
				</div>
				{isAnyFilterActive && (
					<button onClick={handleClearFilters} className={styles.clearButton}>
						<XIcon size={16} />
						Limpiar filtros
					</button>
				)}
			</div>
		</div>
	);
}
