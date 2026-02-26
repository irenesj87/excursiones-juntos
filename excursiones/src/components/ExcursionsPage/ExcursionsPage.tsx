import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { useExcursions } from "../../hooks/useExcursions";
import SearchBar from "../SearchBar/SearchBar";
import { Filters } from "../Filters";
import { ExcursionsList } from "../ExcursionsList/ExcursionsList";
import { getSafeErrorMessage } from "../../utils/errorUtils";
import CustomButton from "../../ui/CustomButton/CustomButton";
import styles from "./ExcursionsPage.module.css";

/**
 * Componente que gestiona y renderiza la página principal de excursiones, incluyendo la búsqueda, los filtros y 
 * la lista de resultados.
 */
export function ExcursionsPage() {
	// 1. Lógica de estado y datos
	const [searchValue, setSearchValue] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	const {
		handleExcursionsFetchStart,
		handleExcursionsFetchSuccess,
		excursionsState,
		handleExcursionsFetchEnd,
	} = useExcursions();

	const handleCloseFilters = () => setShowFilters(false);
	const handleShowFilters = () => setShowFilters(true);

	return (
		<div className="container py-4">
			{/* Botón flotante para abrir filtros (visible solo en < lg) */}
			<CustomButton
				className={`${styles.floatingFilterBtn} d-lg-none ${showFilters ? "d-none" : ""}`}
				onClick={handleShowFilters}
				aria-label="Mostrar filtros"
			>
				<span>Filtros</span>
			</CustomButton>

			<div className="row gx-5">
				{/* Columna de Filtros (Visible solo en >= lg) */}
				<aside className="col-lg-3 d-none d-lg-block">
					<h2 className={styles.filtersTitle}>Filtros</h2>
					<Filters />
				</aside>

				{/* Contenido Principal */}
				<main className="col-lg-9">
					<SearchBar
						id="main-search-bar"
						onFetchSuccess={handleExcursionsFetchSuccess}
						onExcursionsFetchStart={handleExcursionsFetchStart}
						onExcursionsFetchEnd={handleExcursionsFetchEnd}
						searchValue={searchValue}
						onSearchChange={setSearchValue}
					/>

					<div className="mt-5">
						<ExcursionsList
							excursionData={excursionsState.data}
							isLoading={excursionsState.status === "loading"}
							error={
								excursionsState.status === "error"
									? new Error(getSafeErrorMessage(excursionsState.error))
									: null
							}
						/>
					</div>
				</main>
			</div>

			{/* Offcanvas para filtros en breakpoints pequeños */}
			<Offcanvas
				show={showFilters}
				onHide={handleCloseFilters}
				placement="start"
			>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title className={styles.offcanvasTitle}>
						Filtros
					</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body className="padded">
					<Filters />
				</Offcanvas.Body>
			</Offcanvas>
		</div>
	);
}
