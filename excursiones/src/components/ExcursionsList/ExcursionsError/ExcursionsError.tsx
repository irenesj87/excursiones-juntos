import React from "react";
import { AlertIcon } from "../../shared/Icons";
import styles from "./ExcursionsError.module.css";

/**
 * Mensaje de error por defecto que se muestra cuando falla la carga de excursiones.
 */
export const DEFAULT_ERROR_MESSAGE =
	"Lo sentimos, ha ocurrido un error al cargar las excursiones.";

/**
 * Props del componente.
 */
interface ExcursionsErrorProps {
	/** Mensaje opcional para mostrar. Por defecto usa DEFAULT_ERROR_MESSAGE */
	readonly message?: string;
}

/**
 * Componente que muestra un mensaje de error con un icono. Se renderiza cuando la carga de excursiones falla.
 */
function ExcursionsError({
	message = DEFAULT_ERROR_MESSAGE,
}: ExcursionsErrorProps) {
	return (
		<div className={styles.errorContainer}>
			<div role="alert" className={styles.messageNotFound}>
				<AlertIcon className={styles.messageIcon} aria-hidden="true" />
				<p>{message}</p>
			</div>
		</div>
	);
}

export default ExcursionsError;
