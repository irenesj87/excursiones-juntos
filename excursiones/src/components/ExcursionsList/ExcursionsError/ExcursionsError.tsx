import React from "react";
import { AlertIcon } from "../../shared/Icons";
import StyledButton from "../../StyledButton/StyledButton";
import styles from "./ExcursionsError.module.css";

/**
 * Mensaje de error por defecto que se muestra cuando falla la carga de excursiones.
 */
export const DEFAULT_ERROR_MESSAGE =
	"Lo sentimos, ha ocurrido un error al cargar las excursiones.";

/**
 * Texto del botón para reintentar la carga de la página.
 */
export const DEFAULT_RETRY_TEXT = "Reintentar";

/**
 * Props del componente.
 */
interface ExcursionsErrorProps {
	/** Mensaje opcional para mostrar. Por defecto usa DEFAULT_ERROR_MESSAGE */
	readonly message?: string;
	/** Función opcional para ejecutar al pulsar el botón de reintentar */
	readonly onRetry?: () => void;
}

/**
 * Componente que muestra un mensaje de error con un icono. Se renderiza cuando la carga de excursiones falla.
 */
function ExcursionsError({
	message = DEFAULT_ERROR_MESSAGE,
	onRetry,
}: ExcursionsErrorProps) {
	return (
		<div className={styles.errorContainer}>
			<div role="alert" className={styles.messageNotFound}>
				<AlertIcon className={styles.messageIcon} aria-hidden="true" />
				<p>{message}</p>
				{onRetry && (
					<StyledButton
						onClick={onRetry}
						variant="danger"
						className={styles.retryButton}
					>
						{DEFAULT_RETRY_TEXT}
					</StyledButton>
				)}
			</div>
		</div>
	);
}

export default ExcursionsError;
