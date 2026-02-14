import React from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import FiltersListCheckbox from "../FiltersListCheckbox";
import FilterPillSkeleton from "./FilterPillSkeleton";
import { FeedbackAlert } from "../../ui/FeedbackAlert";
import { useFilters } from "./useFetchFilters";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";
import styles from "./FiltersList.module.css";
import type { FilterState } from "../../slices/filterSlice";

const SKELETON_COUNT = 4;
const SKELETON_ITEMS = Array.from({ length: SKELETON_COUNT });

// Props del componente FiltersList.
interface FiltersListProps {
	readonly filterName: keyof FilterState; // El nombre de la categoría de filtro (ej. "area").
}

/**
 * Componente que muestra una lista de filtros para una categoría específica (ej. área, dificultad, tiempo).
 */
export function FiltersList({ filterName }: FiltersListProps): React.ReactElement {
	// El tipo para 'data' se infiere como `string[]` basándonos en su uso posterior.
	// Usamos el hook personalizado para obtener los filtros y el estado de carga/error.
	const { data: arrayFilters, isLoading, error } = useFilters(filterName);

	// Usamos el hook personalizado para obtener los colores del esqueleto según el tema.
	const skeletonThemeProps = useSkeletonTheme();

	// Muestra los esqueletos siempre que isLoading sea true.
	if (isLoading) {
		return (
			<SkeletonTheme {...skeletonThemeProps}>
				{/* Anunciamos el estado de carga a los lectores de pantalla de forma semántica */}
				<output aria-live="polite" className="visually-hidden">
					Cargando filtros de {filterName}...
				</output>
				<ul className={styles.filtersGrid} aria-hidden="true">
					{/* Mostramos esqueletos para evitar saltos de layout */}
					{SKELETON_ITEMS.map((_, index) => (
						<li key={`skeleton-${filterName}-${index}`}>
							<FilterPillSkeleton />
						</li>
					))}
				</ul>
			</SkeletonTheme>
		);
	}
	/**
	 * Muestra un mensaje de error si la carga de filtros falla.
	 */
	if (error) {
		return (
			<FeedbackAlert
				variant="danger"
				message="Hubo un error al cargar los filtros."
			/>
		);
	}

	// Muestra la lista de filtros una vez que la carga ha terminado y no hay errores.
	return (
		<ul className={styles.filtersGrid}>
			{arrayFilters.map((filterOption) => (
				<li key={`${filterName}-${filterOption}`}>
					<FiltersListCheckbox filterName={filterName} filter={filterOption} />
				</li>
			))}
		</ul>
	);
}
