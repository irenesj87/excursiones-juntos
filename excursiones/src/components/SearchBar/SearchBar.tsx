import React, { useRef } from "react";
import { Excursion } from "../../types";
import { SearchIcon, XIcon } from "../../ui/Icons";
import { FeedbackAlert } from "../../ui/FeedbackAlert/FeedbackAlert";
import { useSearchBarLogic, SearchError } from "./useSearchBarLogic";
import styles from "./SearchBar.module.css";

// Propiedades del componente.
interface SearchBarProps {
	// Función que se llama cuando la búsqueda se realiza con éxito, recibiendo las excursiones encontradas.
	readonly onFetchSuccess: (excursions: readonly Excursion[]) => void;

	// Función que se llama al iniciar la búsqueda de excursiones, útil para mostrar un indicador de carga.
	readonly onExcursionsFetchStart: () => void;

	// Función que se llama al finalizar la búsqueda de excursiones, recibiendo un error si ocurrió alguno.
	readonly onExcursionsFetchEnd: (error: SearchError | null) => void;

	// Identificador único para el input de búsqueda, utilizado para accesibilidad.
	readonly id: string;

	// Valor actual del input de búsqueda, controlado desde el componente padre.
	readonly searchValue: string;

	// Función que se llama cuando el valor del input de búsqueda cambia, permitiendo actualizar el estado en el componente padre.
	readonly onSearchChange: (value: string) => void;
}

/**
 * Componente que maneja la barra de búsqueda y la aplicación de filtros para las excursiones.
 */
export function SearchBar({
	onFetchSuccess,
	onExcursionsFetchStart,
	onExcursionsFetchEnd,
	id,
	searchValue,
	onSearchChange,
}: SearchBarProps) {
	// Referencia al input de búsqueda para manejar el foco y otras interacciones. Se utiliza para darle el foco
	// al usuario después de limpiar la búsqueda.
	const searchInputRef = useRef<HTMLInputElement>(null);

	// Extraemos la lógica de negocio al hook personalizado.
	const { error, clearError } = useSearchBarLogic({
		searchValue,
		onFetchSuccess,
		onExcursionsFetchStart,
		onExcursionsFetchEnd,
	});

	/**
	 * Maneja el evento `onChange` del input de búsqueda, actualizando el estado `search`. Notifica al componente
	 * padre cada vez que el usuario teclea algo en el input, permitiendo que la búsqueda se ejecute con el nuevo
	 * valor.
	 */
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onSearchChange(event.target.value);
	};

	/**
	 * Limpia el contenido del input de búsqueda y da el foco al input para que el usuario pueda volver a escribir
	 * sin tener quedar clicks innecesarios.
	 */
	const handleClearSearch = () => {
		onSearchChange("");
		searchInputRef.current?.focus();
	};

	/**
	 * Evita que el navegador recargue la página si el usuario pulsa la tecla Enter.
	 */
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		/* Contenedor principal de la barra de búsqueda, que incluye el formulario y el área de mensajes de error. */
		<div className={styles.wrapper}>
			<form
				// Ayuda a los usuarios de tecnologías asistivas a identificar esta sección como un área de búsqueda.
				role="search"
				className={styles.searchContainer}
				onSubmit={handleSubmit}
			>
				<SearchIcon className={styles.searchIcon} aria-hidden="true" />
				<label htmlFor={id} className="visually-hidden">
					Buscar excursiones por nombre
				</label>
				<input
					ref={searchInputRef}
					id={id}
					className={styles.searchInput}
					type="search"
					placeholder="¿A dónde quieres ir?"
					value={searchValue}
					onChange={handleSearchChange}
				/>
				{/* Solo mostramos el botón de limpiar búsqueda si hay algo escrito en el input, para evitar 
				confusión al usuario. */}
				{searchValue && (
					<button
						type="button"
						className={styles.clearButton}
						onClick={handleClearSearch}
						aria-label="Limpiar búsqueda"
					>
						<XIcon className={styles.clearIcon} aria-hidden="true" />
					</button>
				)}
			</form>
			{/* Si el hook detecta un error, mostramos un mensaje de error amigable para el usuario utilizando el 
			componente FeedbackAlert. */}
			{error && (
				<div className={styles.errorWrapper}>
					<FeedbackAlert
						variant="danger"
						title={error.message}
						message={error.secondaryMessage || ""}
						onClose={clearError}
					/>
				</div>
			)}
		</div>
	);
}
