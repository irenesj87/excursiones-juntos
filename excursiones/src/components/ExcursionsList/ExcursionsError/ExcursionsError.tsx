import React from "react";
import styles from "./ExcursionsError.module.css";

/**
 * Mensaje de error por defecto que se muestra cuando falla la carga de excursiones.
 */
export const DEFAULT_ERROR_MESSAGE =
	"Lo sentimos, ha ocurrido un error al cargar las excursiones.";

/**
 * Componente que muestra un mensaje de error con un icono. Se renderiza cuando la carga de excursiones falla.
 */
const ExcursionsError = () => (
	<div className={styles.errorContainer}>
		<div role="alert" className={styles.messageNotFound}>
			<p>{DEFAULT_ERROR_MESSAGE}</p>
		</div>
	</div>
);

export default ExcursionsError;
