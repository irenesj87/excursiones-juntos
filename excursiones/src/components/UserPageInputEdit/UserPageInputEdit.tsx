import { forwardRef, useState, useEffect, ChangeEvent } from "react";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./UserPageInputEdit.module.css";

/**
 * Propiedades para el componente UserPageInputEdit.
 */
interface UserPageInputEditProps {
	/** ID único para el campo de formulario. */
	readonly id: string;
	/** El valor actual del campo. */
	readonly value: string;
	/** Función para manejar el cambio de valor. */
	readonly onInputChange: (newValue: string) => void;
	/** Indica si el campo está en modo de edición. */
	readonly isEditing: boolean;
	/** Función para validar el valor del campo. Retorna `true` si es válido, o un `string` con el mensaje de error. */
	readonly validationFunction: (value: string) => boolean | string;
	/** Indica si se debe mostrar un mensaje de error. */
	readonly message: boolean;
	/** Mensaje de error específico. Si no se proporciona, se usa uno genérico. */
	readonly errorMessage?: string;
}

function UserPageInputEditComponent(
	props: UserPageInputEditProps,
	ref: React.Ref<HTMLInputElement>
): JSX.Element {
	const {
		id,
		value,
		onInputChange,
		isEditing,
		validationFunction,
		message,
		errorMessage,
	} = props;
	// Estado para almacenar el mensaje de error de validación. `null` si es válido.
	const [validationError, setValidationError] = useState<string | null>(null);
	/**
	 * ID único para el mensaje de error, para asociarlo con el input.
	 */
	const errorId = `${id}-error`;

	/**
	 * Efecto que se ejecuta cuando el modo de edición cambia.
	 * Si se sale del modo de edición, se resetea el estado de validez a `false`.
	 */
	useEffect(() => {
		if (!isEditing) {
			// Cuando se sale del modo de edición, reseteamos el estado de validez
			// para que no se muestren errores de validación previos.
			setValidationError(null);
		}
	}, [isEditing]);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value: newValue } = event.target;
		onInputChange(newValue);
		if (validationFunction) {
			const validationResult = validationFunction(newValue);
			// Si el resultado es `true`, la validación es correcta (sin error -> null).
			// Si es un `string`, es el mensaje de error.
			// Si es `false`, la validación falla, pero no hay mensaje específico,
			// así que usamos un string vacío para indicar el error y mostrar el mensaje genérico.
			setValidationError(
				validationResult === true ? null : validationResult || ""
			);
		}
	};

	const isInvalid = message && validationError !== null;

	return (
		/**
		 * Renderiza el componente de control de formulario.
		 */
		<>
			<Form.Control
				ref={ref}
				className={styles.userInput}
				id={id}
				type="text"
				value={value}
				onChange={handleChange}
				disabled={!isEditing}
				isInvalid={isInvalid}
				aria-describedby={isInvalid ? errorId : undefined}
			/>
			{isInvalid && (
				<Form.Control.Feedback
					type="invalid"
					id={errorId}
					className={`${styles.errorMessage} text-danger fw-bold mt-1`}
					// aria-live="polite" ensures that screen readers announce the error
					// message when it appears, without interrupting the user's flow.
					// This is crucial for dynamic, real-time validation feedback.
					aria-live="polite"
				>
					{validationError ||
						errorMessage ||
						"Recuerda, no puedes dejar un campo vacío o en un formato incorrecto."}
				</Form.Control.Feedback>
			)}
		</>
	);
}

const UserPageInputEdit = forwardRef<HTMLInputElement, UserPageInputEditProps>(
	UserPageInputEditComponent
);

UserPageInputEdit.displayName = "UserPageInputEdit";

export default UserPageInputEdit;
