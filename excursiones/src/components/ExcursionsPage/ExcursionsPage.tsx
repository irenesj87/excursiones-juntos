import { Col, Offcanvas, Badge } from "react-bootstrap";
import Filters from "../Filters";
import StyledButton from "../StyledButton/StyledButton";
import type { ExcursionsState } from "../../hooks/useExcursions";
import ExcursionsList from "../ExcursionsList";
import { FilterIcon } from "../shared/Icons";
import styles from "./ExcursionsPage.module.css";
import { useExcursionsPageLogic } from "./useExcursionsPageLogic";

/**
 * Este componente es el contenedor principal del diseño (layout) para la página de listado de escursiones.
 */

// Props del componente ExcursionsPage.
interface ExcursionsPageProps {
	readonly excursionsState: ExcursionsState;
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
					<StyledButton
						variant="secondary"
						onClick={handleShowFilters}
						className={`w-100 ${styles.filtersToggleButton}`}
						aria-controls="mobile-filters-offcanvas"
						aria-label={ariaFilterLabel}
					>
						<span aria-hidden="true" className="me-2">
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
					</StyledButton>
				</div>

				<ExcursionsList
					excursionData={excursionsState.data}
					isLoading={excursionsState.status === "loading"}
					error={
						excursionsState.status === "error" ? excursionsState.error : null
					}
				/>

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
