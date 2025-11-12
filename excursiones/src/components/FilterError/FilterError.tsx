import React from "react";
import styles from "./FilterError.module.css";

/**
 * Componente para mostrar un mensaje de error cuando falla la carga de los filtros.
 */
const FilterError = () => {
	const message = "No se pudieron cargar los filtros. Inténtalo de nuevo.";
	return (
		<div className={styles.errorContainer} role="alert">
			<div className={styles.errorMessage}>
				<span className="visually-hidden">Error: </span>
				{message}
			</div>
		</div>
	);
};

export default FilterError;
