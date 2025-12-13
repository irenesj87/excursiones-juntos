import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import cn from "classnames";
import { searchExcursions } from "../../services/excursionService";
import { Excursion } from "../../types";
import { RootState } from "../../store/store";
import { SearchIcon, ClearIcon } from "../shared/Icons";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./SearchBar.module.css";

// Constante para el tiempo de tetraso del debounce
const DEBOUNCE_DELAY_MS = 500;

// Define las propiedades que acepta el componente SearchBar.
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
 * Genera un error amigable para el usuario basado en el error técnico capturado.
 */
function createFriendlyError(
	error: unknown
): Error & { secondaryMessage?: string } {
	let userFriendlyError: Error & { secondaryMessage?: string };

	if (error instanceof TypeError && error.message === "Failed to fetch") {
		userFriendlyError = new Error("Error de conexión");
		userFriendlyError.secondaryMessage =
			"No se pudo conectar con el servidor. Por favor, revisa tu conexión a internet e inténtalo de nuevo.";
	} else {
		userFriendlyError = new Error("No se han podido cargar las excursiones.");
		userFriendlyError.secondaryMessage =
			"Por favor, inténtalo de nuevo más tarde.";
	}

	return userFriendlyError;
}

/**
 * Componente que maneja la barra de búsqueda y la aplicación de filtros para las excursiones.
 */
function SearchBar({
	onFetchSuccess,
	onExcursionsFetchStart,
	onExcursionsFetchEnd,
	id,
	searchValue,
	onSearchChange,
}: SearchBarProps) {
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
		}, DEBOUNCE_DELAY_MS);

		return () => clearTimeout(timerId);
	}, [searchValue]);

	// Usamos refs para almacenar las props de función y evitar que el useEffect se vuelva a ejecutar innecesariamente.
	const onFetchSuccessRef = useRef(onFetchSuccess);
	const onExcursionsFetchStartRef = useRef(onExcursionsFetchStart);
	const onExcursionsFetchEndRef = useRef(onExcursionsFetchEnd);

	// Mantenemos las refs actualizadas si las props cambian.
	useEffect(() => {
		onFetchSuccessRef.current = onFetchSuccess;
		onExcursionsFetchStartRef.current = onExcursionsFetchStart;
		onExcursionsFetchEndRef.current = onExcursionsFetchEnd;
	}, [onFetchSuccess, onExcursionsFetchStart, onExcursionsFetchEnd]);

	// Este efecto se ejecuta cada vez que el término de búsqueda "debounced" o los filtros cambian.
	// De esta forma, los filtros se aplican instantáneamente, mientras que la búsqueda por texto espera.
	useEffect(() => {
		const fetchData = async () => {
			onExcursionsFetchStartRef.current();
			try {
				const data = await searchExcursions({
					debouncedSearch,
					area,
					difficulty,
					time,
				});
				onFetchSuccessRef.current(data);
				onExcursionsFetchEndRef.current(null);
			} catch (error) {
				console.error("Error técnico al buscar excursiones:", error);
				onFetchSuccessRef.current([]);

				onExcursionsFetchEndRef.current(createFriendlyError(error));
			}
		};

		fetchData();
	}, [debouncedSearch, area, difficulty, time]);

	return (
		<form
			role="search"
			className={styles.searchContainer}
			onSubmit={(e) => e.preventDefault()}
		>
			<SearchIcon className={styles.searchIcon} aria-hidden="true" />
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
				>
					<ClearIcon className={styles.clearIcon} aria-hidden="true" />
				</button>
			)}
		</form>
	);
}

export default SearchBar;
