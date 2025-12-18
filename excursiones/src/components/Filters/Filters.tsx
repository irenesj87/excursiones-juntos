import React from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FiltersList from "../FiltersList";
import { clearAllFilters } from "../../slices/filterSlice";
import { ChartIcon, ClockIcon, MapIcon, FilterXIcon } from "../shared/Icons";
import styles from "./Filters.module.css";
import { RootState } from "../../store/store";

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
		title: "Tiempo estimado",
		icon: <ClockIcon className={styles.filterIcon} />,
	},
] satisfies FilterSection[];

/**
 * Hook personalizado para encapsular la lógica de estado y acciones de los filtros.
 */
function useFiltersLogic() {
	const dispatch = useDispatch();

	const hasActiveFilters = useSelector((state: RootState) => {
		const { area, difficulty, time } = state.filterReducer;
		return area.length > 0 || difficulty.length > 0 || time.length > 0;
	});

	const handleClearFilters = () => {
		if (hasActiveFilters) {
			dispatch(clearAllFilters());
		}
	};

	return { hasActiveFilters, handleClearFilters };
}

/**
 * Componente que renderiza el panel de filtros.
 * Muestra diferentes secciones de filtrado (zona, dificultad, tiempo) y un botón para limpiar todas las selecciones.
 * @param props - Las props del componente.
 * @returns - El componente de filtros.
 */
function Filters({ showTitle = true }: FiltersProps) {
	const { hasActiveFilters, handleClearFilters } = useFiltersLogic();

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
					<FilterXIcon className={styles.filterIcon} />
					<span className="ms-2">Limpiar Filtros</span>
				</Button>
			</footer>
		</div>
	);
}

export default Filters;
