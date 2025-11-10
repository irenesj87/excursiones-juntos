import React, { useState } from "react";
import { Col, Button, Offcanvas, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { FiFilter } from "react-icons/fi";
import Filters from "../Filters";
import ExcursionsList from "../ExcursionsList";
import styles from "./ExcursionsPage.module.css";

interface ExcursionsPageProps {
	excursionsState: {
		data: import("../../types").Excursion[];
		isLoading: boolean;
		error: (Error & { secondaryMessage?: string }) | null;
	};
}

/**
 * Componente para la página de excursiones que muestra los filtros y la lista de excursiones.
 */
const ExcursionsPage = ({ excursionsState }: ExcursionsPageProps) => {
	// Estado para controlar la visibilidad del menú de filtros en breakpoints pequeños.
	const [showFilters, setShowFilters] = useState(false);
	// Cierra el menú de filtros.
	const handleCloseFilters = () => setShowFilters(false);
	// Muestra el menú de filtros.
	const handleShowFilters = () => setShowFilters(true);

	// Calcula el número total de filtros activos (área, dificultad, tiempo) desde el estado de Redux.
	const activeFilterCount = useSelector((state: RootState) => {
		const { area, difficulty, time } = state.filterReducer;
		return area.length + difficulty.length + time.length;
	});

	// Texto para el contador de filtros.
	const filterCountText =
		activeFilterCount === 1 ? "seleccionado" : "seleccionados";

	// Texto dinámico para el `aria-label` del botón de filtros, mejorando la accesibilidad.
	const ariaFilterLabel = `Mostrar filtros. ${activeFilterCount} ${
		activeFilterCount === 1 ? "filtro aplicado" : "filtros aplicados"
	}.`;

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
						{/* Ocultamos el contenido visual a los lectores de pantalla para evitar redundancia,
						ya que el aria-label ya proporciona toda la información necesaria. */}
						<FiFilter className="me-2" aria-hidden="true" />
						<span aria-hidden="true">
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
};

export default ExcursionsPage;
