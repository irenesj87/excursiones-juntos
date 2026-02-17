import { Suspense, lazy, useState } from "react";
import {
	Col,
	Container,
	Row,
	OffcanvasBody,
	OffcanvasHeader,
	OffcanvasTitle,
} from "react-bootstrap";
import { Filters } from "../Filters";
import StyledButton from "../../ui/CustomButton/CustomButton";
import type { ExcursionsState } from "../../hooks/useExcursions";
import { ExcursionsList } from "../ExcursionsList";
import styles from "./ExcursionsPage.module.css";

/**
 * IDs para accesibilidad y control del Offcanvas.
 */
const MOBILE_FILTERS_ID = "mobile-filters-offcanvas";
const MOBILE_FILTERS_TITLE_ID = "mobile-filters-title";

/**
 * Este componente es el contenedor principal del diseño (layout) para la página de listado de escursiones y los
 * filtros, manejando la responsividad entre diferentes breakpoints.
 */

// Props del componente ExcursionsPage.
interface ExcursionsPageProps {
	// Estado de la petición de las excursiones. Contiene los datos, el estado de carga y posibles errores.
	readonly excursionsState: ExcursionsState;
}

/**
 * El componente Offcanvas se carga con lazy loading ya que sólo se utiliza en breakpoints pequeños.
 */
const LazyOffcanvas = lazy(() => import("react-bootstrap/esm/Offcanvas"));

/**
 * Componente principal.
 */
export function ExcursionsPage({ excursionsState }: ExcursionsPageProps) {
	const [showFilters, setShowFilters] = useState(false);
	const handleCloseFilters = () => setShowFilters(false);
	const handleShowFilters = () => setShowFilters(true);

	return (
		<Container fluid className="d-flex flex-column flex-grow-1">
			<Row className="justify-content-start flex-grow-1 align-items-stretch">
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
					as="main"
					xs={12}
					md={8}
					lg={9}
					xl={10}
					className="d-flex flex-column position-relative"
				>
					{/* Botón para mostrar filtros (visible hasta 'md') */}
					<div className={`d-md-none ${styles.mobileFiltersBar}`}>
						<StyledButton
							variant="secondary"
							onClick={handleShowFilters}
							className={styles.filtersToggleButton}
							aria-controls={MOBILE_FILTERS_ID}
							aria-label="Mostrar filtros"
						>
							Mostrar filtros
						</StyledButton>
					</div>

					{/**
					 * Renderiza el componente pasándole toda la información necesaria del estado actual de la
					 * petición de datos.
					 */}
					<ExcursionsList
						excursionData={excursionsState.data}
						isLoading={excursionsState.status === "loading"}
						error={
							excursionsState.status === "error" ? excursionsState.error : null
						}
					/>

					{/* Menú Offcanvas para los filtros en breakpoints hasta 'md'. */}
					<Suspense fallback={null}>
						<LazyOffcanvas
							show={showFilters}
							onHide={handleCloseFilters}
							placement="start"
							className="d-md-none offcanvasRounded"
							id={MOBILE_FILTERS_ID}
							aria-labelledby={MOBILE_FILTERS_TITLE_ID}
						>
							<OffcanvasHeader closeButton>
								<OffcanvasTitle
									id={MOBILE_FILTERS_TITLE_ID}
									className={styles.offcanvasTitle}
								>
									Filtros
								</OffcanvasTitle>
							</OffcanvasHeader>
							<OffcanvasBody className="d-flex flex-column">
								<Filters showTitle={false} />
							</OffcanvasBody>
						</LazyOffcanvas>
					</Suspense>
				</Col>
			</Row>
		</Container>
	);
}
