import React from "react";
import styles from "./FilterError.module.css";
import { CircleAlertIcon } from "../../ui/Icons";

/**
 * Componente para mostrar un mensaje de error cuando falla la carga de los filtros.
 */
function FilterError() {
	const message = "No se pudieron cargar los filtros. Inténtalo de nuevo.";
	return (
		<div className={styles.errorContainer} role="alert">
			<CircleAlertIcon className={styles.errorIcon} aria-hidden="true" />
			<p className={styles.errorMessage}>
				<span className="visually-hidden">Error: </span>
				{message}
			</p>
		</div>
	);
}

export default FilterError;
