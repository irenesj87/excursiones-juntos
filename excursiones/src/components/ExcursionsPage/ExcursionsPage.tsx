import { useState } from "react";
import { useExcursions } from "../../hooks/useExcursions";
import SearchBar from "../SearchBar/SearchBar";
import { Filters } from "../Filters";
import { ExcursionsList } from "../ExcursionsList/ExcursionsList";
import { getSafeErrorMessage } from "../../utils/errorUtils";

/**
 * Componente que gestiona y renderiza la página principal de excursiones,
 * incluyendo la búsqueda, los filtros y la lista de resultados.
 */
export function ExcursionsPage() {
	// 1. Lógica de estado y datos (movida desde Layout.tsx)
	const [searchValue, setSearchValue] = useState("");
	const {
		handleExcursionsFetchStart,
		handleExcursionsFetchSuccess,
		excursionsState,
		handleExcursionsFetchEnd,
	} = useExcursions();

	return (
		// El fondo beige (--color-background-body) ya lo aplica el body
		<div className="container py-4">
			{/* 2. Barra de Búsqueda */}
			<div className="row justify-content-center">
				<div className="col-lg-8">
					<SearchBar
						id="main-search-bar"
						onFetchSuccess={handleExcursionsFetchSuccess}
						onExcursionsFetchStart={handleExcursionsFetchStart}
						onExcursionsFetchEnd={handleExcursionsFetchEnd}
						searchValue={searchValue}
						onSearchChange={setSearchValue}
					/>
				</div>
			</div>

			{/* 3. Filtros Horizontales */}
			<div className="row justify-content-center mt-5">
				<div className="col-12">
					<Filters />
				</div>
			</div>

			{/* 4. Lista de Resultados */}
			<div className="row mt-5">
				<div className="col-12">
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
			</div>
		</div>
	);
}
