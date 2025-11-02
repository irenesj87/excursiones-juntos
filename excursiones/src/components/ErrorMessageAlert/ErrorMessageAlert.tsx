import { Alert } from "react-bootstrap";
import { GENERIC_ERROR_MESSAGE } from "../../constants";

/**
 * Propiedades para el componente ErrorMessageAlert.
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
	// Verificación de seguridad: Nos aseguramos de que el mensaje sea una cadena de texto
	// para prevenir vulnerabilidades de Cross-Site Scripting (XSS). Si se recibe algo
	// que no es un string, se mostrará un mensaje de error genérico y seguro.
	const content = typeof message === "string" ? message : GENERIC_ERROR_MESSAGE;

	// SECURITY: El contenido se renderiza directamente dentro de la etiqueta.
	// React JSX escapa automáticamente este contenido, previniendo ataques XSS.
	// NUNCA uses `dangerouslySetInnerHTML` con contenido que pueda ser controlado por el usuario.
	return (
		<Alert variant="danger" onClose={onClose} dismissible>
			<Alert.Heading as="h2">Error</Alert.Heading>
			{content}
		</Alert>
	);
};

export default ErrorMessageAlert;
