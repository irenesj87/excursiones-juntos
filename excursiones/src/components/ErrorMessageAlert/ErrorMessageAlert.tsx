import React from "react";
import { Alert } from "react-bootstrap";

/**
 * `ErrorMessageAlert` es un componente funcional que muestra un mensaje de error
 * en un formato de alerta de Bootstrap, permitiendo al usuario cerrarla.
 */
interface ErrorMessageAlertProps {
	/** El mensaje de error a mostrar. */
	message: string;
	/** Función que se ejecuta cuando se cierra la alerta. */
	onClose: () => void;
}

/**
 * Componente que muestra una alerta de error.
 */
const ErrorMessageAlert = ({ message, onClose }: ErrorMessageAlertProps) => {
	// SECURITY: El contenido se renderiza directamente dentro de la etiqueta.
	// React JSX escapa automáticamente este contenido, previniendo ataques XSS.
	// NUNCA uses `dangerouslySetInnerHTML` con contenido que pueda ser controlado por el usuario.
	return (
		<Alert variant="danger" onClose={onClose} dismissible>
			<Alert.Heading as="h2">Error</Alert.Heading>
			{message}
		</Alert>
	);
};

export default ErrorMessageAlert;
