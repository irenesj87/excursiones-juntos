import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import cn from "classnames";
import { searchExcursions } from "../../services/excursionService";
import { Excursion } from "../../types";
import { RootState } from "../../store/store";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
	readonly onFetchSuccess: (excursions: readonly Excursion[]) => void;
	readonly onExcursionsFetchStart: () => void;
	readonly onExcursionsFetchEnd: (
		error: (Error & { secondaryMessage?: string }) | null
	) => void;
	readonly id: string;
	readonly searchValue: string;
	readonly onSearchChange: (value: string) => void;
}

/**
 * Componente que maneja la barra de búsqueda y la aplicación de filtros para las excursiones.
 */
const SearchBar = ({
	onFetchSuccess,
	onExcursionsFetchStart,
	onExcursionsFetchEnd,
	id,
	searchValue,
	onSearchChange,
}: SearchBarProps) => {
	const [debouncedSearch, setDebouncedSearch] = useState(searchValue);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const { area, difficulty, time } = useSelector(
		(state: RootState) => state.filterReducer,
		shallowEqual
	);

	/**
	 * Maneja el evento `onChange` del input de búsqueda, actualizando el estado `search`.
	 */
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onSearchChange(event.target.value);
	};

	/**
	 * Limpia el contenido del input de búsqueda y da el foco al mismo.
	 */
	const handleClearSearch = () => {
		onSearchChange("");
		searchInputRef.current?.focus();
	};

	// Efecto para aplicar el "debounce" al término de búsqueda.
	// Solo actualiza `debouncedSearch` cuando el usuario deja de teclear por 500ms.
	useEffect(() => {
		const timerId = setTimeout(() => {
			setDebouncedSearch(searchValue);
		}, 500);

		return () => clearTimeout(timerId);
	}, [searchValue]);

	/**
	 * Realiza la petición de búsqueda de excursiones. El compilador de React se encargará de memoizar esta función.
	 */
	const fetchData = async () => {
		onExcursionsFetchStart();
		try {
			const data = await searchExcursions(
				debouncedSearch,
				area,
				difficulty,
				time
			);
			onFetchSuccess(data);
			onExcursionsFetchEnd(null);
		} catch (error) {
			console.error("Error técnico al buscar excursiones:", error);
			onFetchSuccess([]);

			if (error instanceof TypeError && error.message === "Failed to fetch") {
				console.error(
					"Pista para el desarrollador: El servidor de la API no parece estar respondiendo. ¿Está en marcha? Revisa también la configuración de CORS."
				);
			}

			let userFriendlyError: Error & { secondaryMessage?: string };

			if (error instanceof TypeError && error.message === "Failed to fetch") {
				userFriendlyError = new Error("Error de conexión");
				userFriendlyError.secondaryMessage =
					"No se pudo conectar con el servidor. Por favor, revisa tu conexión a internet e inténtalo de nuevo.";
			} else {
				userFriendlyError = new Error(
					"No se han podido cargar las excursiones."
				);
				userFriendlyError.secondaryMessage =
					"Por favor, inténtalo de nuevo más tarde.";
			}

			onExcursionsFetchEnd(userFriendlyError);
		}
	};

	// Este efecto se ejecuta cada vez que el término de búsqueda "debounced" o los filtros cambian.
	// De esta forma, los filtros se aplican instantáneamente, mientras que la búsqueda por texto espera.
	useEffect(() => {
		fetchData();
	}, [debouncedSearch, area, difficulty, time]);

	return (
		<form
			role="search"
			className={styles.searchContainer}
			onSubmit={(e) => e.preventDefault()}
		>
			<label htmlFor={id} className="visually-hidden">
				Buscar excursiones por nombre
			</label>
			<input
				ref={searchInputRef}
				id={id}
				className={cn("form-control", styles.searchInput)}
				type="search"
				placeholder="Busca excursiones por nombre..."
				value={searchValue}
				onChange={handleSearchChange}
			/>
			{searchValue && (
				<button
					type="button"
					className={styles.clearButton}
					onClick={handleClearSearch}
					aria-label="Limpiar búsqueda"
				></button>
			)}
		</form>
	);
}

export default SearchBar;
