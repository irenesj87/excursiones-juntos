import React from "react";
import { Alert } from "react-bootstrap";
import cn from "classnames";
import { AlertIcon } from "../Icons";
import styles from "./Alert.module.css";

const DEFAULT_TITLE = "Error";

/**
 * @component ErrorMessageAlert
 * @description Muestra un mensaje de error crítico utilizando componentes de Bootstrap.
 */
interface ErrorMessageAlertProps {
	/** El mensaje de error a mostrar. */
	readonly message: string;
	/** Función que se ejecuta cuando se cierra la alerta. */
	readonly onClose: () => void;
	/** Título opcional de la alerta. Por defecto es "Error". */
	readonly title?: string;
	/** Clases CSS adicionales para el contenedor de la alerta. */
	readonly className?: string;
}

/**
 * Componente que muestra una alerta de error.
 */
function ErrorMessageAlert({
	message,
	onClose,
	title = DEFAULT_TITLE,
	className,
}: ErrorMessageAlertProps) {
	return (
		<Alert
			variant="danger"
			onClose={onClose}
			dismissible
			className={cn(styles.alert, className)}
		>
			<div className={styles.alertContent}>
				<AlertIcon size={24} className={styles.icon} aria-hidden="true" />
				<div>
					<Alert.Heading as="h2" className={styles.title}>
						{title}
					</Alert.Heading>
					<p className={styles.message}>{message}</p>
				</div>
			</div>
		</Alert>
	);
}

export default ErrorMessageAlert;
