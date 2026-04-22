import { useRef, ChangeEvent, FormEvent } from "react";
import { Excursion, AppError } from "../../types";
import { SearchIcon, XIcon } from "../../ui/Icons";
import { FeedbackAlert } from "../../ui/FeedbackAlert/FeedbackAlert";
import { useSearchBarLogic } from "./useSearchBarLogic";
import { Input } from "../../ui/input";
import { cn } from "../../lib/utils";

// Propiedades del componente.
interface SearchBarProps {
	// Función que se llama cuando la búsqueda se realiza con éxito, recibiendo las excursiones encontradas.
	readonly onFetchSuccess: (excursions: readonly Excursion[]) => void;

	// Función que se llama al iniciar la búsqueda de excursiones, útil para mostrar un indicador de carga.
	readonly onExcursionsFetchStart: () => void;

	// Función que se llama al finalizar la búsqueda de excursiones, recibiendo un error si ocurrió alguno.
	readonly onExcursionsFetchEnd: (error: AppError | null) => void;

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
	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
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
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
	};

	return (
		/* Contenedor principal de la barra de búsqueda, que incluye el formulario y el área de mensajes de error. */
		<div className="flex flex-col gap-4 w-full mb-6">
			<form
				// Ayuda a los usuarios de tecnologías asistivas a identificar esta sección como un área de búsqueda.
				role="search"
				className="relative flex items-center w-full group"
				onSubmit={handleSubmit}
			>
				<SearchIcon
					className="absolute left-5 top-1/2 -translate-y-1/2 z-20 text-muted-foreground group-focus-within:text-nature-600 dark:group-focus-within:text-nature-400 pointer-events-none"
					size={20}
					aria-hidden="true"
				/>
				<label htmlFor={id} className="visually-hidden">
					Buscar excursiones por nombre
				</label>
				<Input
					ref={searchInputRef}
					id={id}
					type="search"
					placeholder="¿A dónde quieres ir?"
					value={searchValue}
					onChange={handleSearchChange}
					className={cn(
						"h-14 !pl-12 pr-14 text-base focus-visible:ring-nature-600 focus-visible:ring-offset-2 rounded-2xl",
						// Modo Claro: Fondo card y borde estándar
						"bg-card border-input text-foreground placeholder:text-muted-foreground shadow-premium",
						// Modo Oscuro: Fondo verde bosque más claro que el body y sombra profunda para elevación
						"dark:bg-nature-800/50 dark:border-nature-700/50 dark:shadow-2xl dark:shadow-black/60",
						// Elimina el botón de cancelar búsqueda nativo de Webkit
						"[&::-webkit-search-decoration]:appearance-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
						searchValue && "pr-16",
					)}
				/>
				{/* Solo mostramos el botón de limpiar búsqueda si hay algo escrito en el input, para evitar 
				confusión al usuario. */}
				{searchValue && (
					<button
						type="button"
						className="absolute right-3 z-20 h-10 w-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-nature-600 dark:hover:text-nature-400 hover:bg-accent active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nature-600"
						onClick={handleClearSearch}
						aria-label="Limpiar búsqueda"
					>
						<XIcon size={18} aria-hidden="true" />
					</button>
				)}
			</form>
			{/* Si el hook detecta un error, mostramos un mensaje de error amigable para el usuario utilizando el 
			componente FeedbackAlert. */}
			{error && (
				<div className="animate-in fade-in slide-in-from-top-2 duration-300">
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
