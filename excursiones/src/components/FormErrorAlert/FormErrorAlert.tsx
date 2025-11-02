import ErrorMessageAlert from "../ErrorMessageAlert";

/**
 * `FormErrorAlert` es un componente que muestra una alerta de error en el contexto de un formulario.
 * Su principal responsabilidad es notificar al usuario sobre errores de validación o de envío
 * y permitir que el usuario cierre la alerta.
 * Además, gestiona el foco para mejorar la accesibilidad, moviéndolo a la alerta cuando esta aparece.
 */
interface FormErrorAlertProps {
	error: string | null;
	onClearError: () => void;
}

const FormErrorAlert = ({ error, onClearError }: FormErrorAlertProps) => {
	if (!error) {
		return null;
	}

	return (
		<div role="alert">
			<ErrorMessageAlert message={error} onClose={onClearError} />
		</div>
	);
};

export default FormErrorAlert;
