import React from "react";
import styles from "./FilterError.module.css";
import { AlertIcon } from "../shared/Icons";

/**
 * Componente para mostrar un mensaje de error cuando falla la carga de los filtros.
 */
function FilterError() {
	const message = "No se pudieron cargar los filtros. Inténtalo de nuevo.";
	return (
		<div className={styles.errorContainer} role="alert">
			<AlertIcon className={styles.errorIcon} aria-hidden="true" />
			<p className={styles.errorMessage}>{message}</p>
		</div>
	);
}

export default FilterError;
