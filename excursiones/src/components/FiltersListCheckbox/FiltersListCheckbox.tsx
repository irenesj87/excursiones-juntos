import { useId } from "react";
import cn from "classnames";
import { useFilterCheckboxLogic } from "./useFilterCheckboxLogic";
import styles from "./FiltersListCheckbox.module.css";
import type { FilterState } from "../../slices/filterSlice";
import { XIcon } from "../../ui/Icons";

/** Props para el componente FiltersListCheckbox. */
interface FiltersListCheckboxProps {
	/** El nombre de la categoría de filtro (ej. 'area', 'difficulty'). */
	readonly filterName: keyof FilterState;
	/** El valor específico del filtro a mostrar (ej. 'Centro', 'Baja'). */
	readonly filter: string;
}

/** Props para el componente interno FilterLabel. */
interface LabelProps {
	/** El ID del input al que esta etiqueta está asociada. */
	readonly htmlFor: string;
	/** El texto del filtro a mostrar en la etiqueta. */
	readonly filter: string;
	/** Indica si el filtro está actualmente seleccionado. */
	readonly isChecked: boolean;
}

const CLOSE_ICON_SIZE = 20;

/**
 * Componente de UI interno que renderiza la etiqueta estilizada como una "píldora".
 * Muestra un icono de cierre si el filtro está seleccionado.
 * @param htmlFor - El ID del input asociado.
 * @param filter - El texto a mostrar.
 * @param isChecked - El estado de selección.
 */
function FilterLabel({ htmlFor, filter, isChecked }: LabelProps) {
	return (
		<label
			htmlFor={htmlFor}
			className={cn(styles.filterPill, {
				[styles.checked]: isChecked,
			})}
		>
			<span>{filter}</span>
			{isChecked && (
				<XIcon
					className={styles.closeIcon}
					size={CLOSE_ICON_SIZE}
					aria-hidden="true"
				/>
			)}
		</label>
	);
}

/**
 * Componente que representa un único checkbox de filtro, estilizado como una "píldora" (pill).
 * Utiliza un input de tipo checkbox oculto para la accesibilidad y una etiqueta (`<label>`)
 * para la interacción visual.
 */
export function FiltersListCheckbox({
	filterName,
	filter,
}: FiltersListCheckboxProps) {
	// Usamos el hook personalizado para obtener el estado y la función manejadora.
	const { isChecked, handleToggle } = useFilterCheckboxLogic(
		filterName,
		filter,
	);

	// Genera un ID único para el checkbox y su etiqueta asociada.
	const id = useId();

	// Renderizamos el checkbox oculto y la etiqueta estilizada como un "pill".
	return (
		<>
			<input
				type="checkbox"
				id={id}
				name={filterName}
				value={filter}
				checked={isChecked}
				onChange={handleToggle}
				className={styles.visuallyHidden}
			/>
			<FilterLabel htmlFor={id} filter={filter} isChecked={isChecked} />
		</>
	);
}
