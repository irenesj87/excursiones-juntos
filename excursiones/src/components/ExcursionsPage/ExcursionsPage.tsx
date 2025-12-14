import React, { useState } from "react";
import { Col, Button, Offcanvas, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Filters from "../Filters";
import { AppError, Excursion } from "../../types";
import ExcursionsList from "../ExcursionsList";
import { FilterIcon } from "../shared/Icons";
import styles from "./ExcursionsPage.module.css";

// Definición del tipo para el estado de las excursiones.
type ExcursionsState = {
	readonly data: readonly Excursion[];
	isLoading: boolean;
	error: AppError | null;
};

// Props del componente ExcursionsPage.
interface ExcursionsPageProps {
	readonly excursionsState: ExcursionsState;
}

/**
 * Hook personalizado para manejar la lógica de la página de excursiones.
 * Gestiona la visibilidad de los filtros en breakpoints pequeños y el conteo de filtros activos.
 */
function useExcursionsPageLogic() {
	const [showFilters, setShowFilters] = useState(false);

	const handleCloseFilters = () => setShowFilters(false);
	const handleShowFilters = () => setShowFilters(true);

	const activeFilterCount = useSelector((state: RootState) => {
		const { area, difficulty, time } = state.filterReducer;
		return area.length + difficulty.length + time.length;
	});

	const filterCountText =
		activeFilterCount === 1 ? "seleccionado" : "seleccionados";

	const ariaFilterLabel = `Mostrar filtros. ${activeFilterCount} ${
		activeFilterCount === 1 ? "filtro aplicado" : "filtros aplicados"
	}.`;

	return {
		showFilters,
		handleCloseFilters,
		handleShowFilters,
		activeFilterCount,
		filterCountText,
		ariaFilterLabel,
	};
}

/**
 * Componente para la página de excursiones que muestra los filtros y la lista de excursiones.
 */
function ExcursionsPage({ excursionsState }: ExcursionsPageProps) {
	const {
		showFilters,
		handleCloseFilters,
		handleShowFilters,
		activeFilterCount,
		filterCountText,
		ariaFilterLabel,
	} = useExcursionsPageLogic();

	// La lista de excursiones.
	const excursionsList = (
		<ExcursionsList
			excursionData={excursionsState.data}
			isLoading={excursionsState.isLoading}
			error={excursionsState.error}
		/>
	);

	return (
		<>
			{/* Columna de filtros visible a partir de 'md' en adelante */}
			<Col
				as="aside"
				md={4}
				lg={3}
				xl={2}
				className="d-none d-md-block ps-md-0 pe-md-0"
			>
				<Filters />
			</Col>
			{/* Contenido principal */}
			<Col
				xs={12}
				md={8}
				lg={9}
				xl={10}
				className="d-flex flex-column position-relative"
			>
				{/* Botón para mostrar filtros (visible hasta 'md') */}
				<div
					className={`d-grid d-md-none sticky-top ${styles.mobileFiltersBar}`}
				>
					<Button
						variant="outline-secondary"
						onClick={handleShowFilters}
						className={`w-100 ${styles.filtersToggleButton}`}
						aria-controls="mobile-filters-offcanvas"
						aria-label={ariaFilterLabel}
					>
						<span aria-hidden="true">
							<FilterIcon className={styles.filterIcon} />
						</span>
						<span>
							Mostrar Filtros
							{activeFilterCount > 0 && (
								<Badge pill className={`${styles.filterBadge} ms-2`}>
									{activeFilterCount} {filterCountText}
								</Badge>
							)}
						</span>
					</Button>
				</div>
				{excursionsList}
				{/* Menú Offcanvas para los filtros en breakpoints hasta 'md'. */}
				<Offcanvas
					show={showFilters}
					onHide={handleCloseFilters}
					placement="start"
					className="d-md-none"
					id="mobile-filters-offcanvas"
					aria-labelledby="mobile-filters-title"
				>
					<Offcanvas.Header closeButton className="pb-0">
						<Offcanvas.Title
							id="mobile-filters-title"
							className={styles.offcanvasTitle}
						>
							Filtros
						</Offcanvas.Title>
					</Offcanvas.Header>
					<Offcanvas.Body className="d-flex flex-column">
						<Filters showTitle={false} />
					</Offcanvas.Body>
				</Offcanvas>
			</Col>
		</>
	);
}

export default ExcursionsPage;
