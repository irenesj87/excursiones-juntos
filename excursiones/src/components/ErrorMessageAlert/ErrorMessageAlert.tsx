import React from "react";
import { Alert } from "react-bootstrap";

/** 
 * @component ErrorMessageAlert
 * @description Es un componente funcional que muestra un mensaje de error en un formato de alerta de Bootstrap, 
 * permitiendo al usuario cerrarla.
 */
interface ErrorMessageAlertProps {
	/** El mensaje de error a mostrar. */
	readonly message: string;
	/** Función que se ejecuta cuando se cierra la alerta. */
	readonly onClose: () => void;
}

/**
 * Componente que muestra una alerta de error.
 */
function ErrorMessageAlert({ message, onClose }: ErrorMessageAlertProps) {
	return (
		<Alert variant="danger" onClose={onClose} dismissible>
			<Alert.Heading as="h2">Error</Alert.Heading>
			{message}
		</Alert>
	);
}

export default ErrorMessageAlert;
