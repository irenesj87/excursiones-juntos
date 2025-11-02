import { useRef, useEffect, FC } from "react";
import ErrorMessageAlert from "../ErrorMessageAlert";

/**
 * Usamos una 'interface' para definir la forma de las props.
 * Es el equivalente directo y más potente de tu @typedef de JSDoc.
 */
interface FormErrorAlertProps {
	error: string | null;
	onClearError: () => void;
}

const FormErrorAlert: FC<FormErrorAlertProps> = ({ error, onClearError }) => {
	// Tipamos el ref para que TypeScript sepa que es una referencia a un elemento div.
	const errorAlertRef = useRef<HTMLDivElement>(null);

	// Efecto para mover el foco a la alerta de error cuando aparece.
	useEffect(() => {
		// TypeScript ahora sabe que .current puede tener un método .focus()
		if (error && errorAlertRef.current) {
			errorAlertRef.current.focus();
		}
	}, [error]);

	if (!error) {
		return null;
	}

	return (
		// El div wrapper permite que la alerta sea programáticamente enfocable.
		// tabIndex="-1" lo hace enfocable vía JS sin añadirlo al orden de tabulación.
		<div ref={errorAlertRef} tabIndex={-1}>
			<ErrorMessageAlert message={error} onClose={onClearError} />
		</div>
	);
};

export default FormErrorAlert;
