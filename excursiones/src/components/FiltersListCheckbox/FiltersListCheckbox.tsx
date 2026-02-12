import { useId } from "react";
import cn from "classnames";
import { useFilterCheckboxLogic } from "./useFilterCheckboxLogic";
import styles from "./FiltersListCheckbox.module.css";
import type { FilterState } from "../../slices/filterSlice";

interface FiltersListCheckboxProps {
	readonly filterName: keyof FilterState; // Por ejemplo: 'area', 'difficulty', 'time'
	readonly filter: string; // El valor específico del filtro, por ejemplo: 'Centro', 'Baja'
}

interface LabelProps {
	readonly htmlFor: string;
	readonly filter: string;
	readonly isChecked: boolean;
}

// Componente interno para la etiqueta del filtro.
function FilterLabel({ htmlFor, filter, isChecked }: LabelProps) {
	return (
		<label
			htmlFor={htmlFor}
			className={cn(styles.filterPill, {
				[styles.checked]: isChecked,
			})}
		>
			{filter}
		</label>
	);
}

function FiltersListCheckbox({ filterName, filter }: FiltersListCheckboxProps) {
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

export default FiltersListCheckbox;
