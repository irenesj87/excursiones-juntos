import React from "react";
import { Alert } from "react-bootstrap";
import { AlertIcon } from "../shared/Icons";

const DEFAULT_TITLE = "Error";

/**
 * @component ErrorMessageAlert
 * @description Muestra un mensaje de error crítico utilizando componentes de Bootstrap.
 * Incorpora un icono para mejorar la accesibilidad visual y no depender solo del color.
 */
interface ErrorMessageAlertProps {
	/** El mensaje de error a mostrar. */
	readonly message: string;
	/** Función que se ejecuta cuando se cierra la alerta. */
	readonly onClose: () => void;
	/** Título opcional de la alerta. Por defecto es "Error". */
	readonly title?: string;
}

/**
 * Componente que muestra una alerta de error.
 */
function ErrorMessageAlert({
	message,
	onClose,
	title = DEFAULT_TITLE,
}: ErrorMessageAlertProps) {
	return (
		<Alert variant="danger" onClose={onClose} dismissible>
			<div className="d-flex gap-3 align-items-start">
				<AlertIcon
					size={24}
					className="flex-shrink-0 mt-1"
					aria-hidden="true"
				/>
				<div>
					<Alert.Heading as="h2" className="h5">
						{title}
					</Alert.Heading>
					<p className="mb-0">{message}</p>
				</div>
			</div>
		</Alert>
	);
}

export default ErrorMessageAlert;
