import { FiAlertCircle } from "react-icons/fi";
import styles from "./ExcursionsError.module.css";

/** @typedef {import('react')} React */

export const DEFAULT_ERROR_MESSAGE =
	"Lo sentimos, ha ocurrido un error al cargar las excursiones.";

/**
 * Componente que muestra un mensaje de error con un icono. Se renderiza cuando la carga de excursiones falla.
 * @returns {React.ReactElement} - El componente de mensaje de error.
 */
const ExcursionsError = () => (
	<div className={styles.errorContainer}>
		<div role="alert" className={styles.messageNotFound}>
			<FiAlertCircle
				className={`${styles.messageIcon} text-danger`}
				aria-hidden="true"
			/>
			<p>{DEFAULT_ERROR_MESSAGE}</p>
		</div>
	</div>
);

export default ExcursionsError;
