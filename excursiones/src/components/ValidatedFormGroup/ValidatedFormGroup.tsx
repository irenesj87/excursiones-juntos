import React, { useState, ChangeEvent } from "react";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./ValidatedFormGroup.module.css";

/**
 * Propiedades para el componente ValidatedFormGroup.
 */
interface ValidatedFormGroupProps {
	/** ID único para el campo de formulario y la etiqueta. */
	readonly id: string;
	/** Texto para la etiqueta del campo. */
	readonly name: string;
	/** Tipo de input (ej. "text", "email", "password"). El valor por defecto es "text". */
	readonly inputType?: string;
	/** Función para actualizar el estado del valor del input en el componente padre. */
	readonly inputToChange: (value: string) => void;
	/** Función que valida el valor del input. Retorna `true` si es válido, o un `string` con el mensaje de error. */
	readonly validationFunction: (value: string) => boolean | string;
	/** El valor actual del campo de formulario. */
	readonly value: string;
	/** Si es true, muestra un mensaje de error cuando la validación falla. */
	readonly message: boolean;
	/** Mensaje de error específico. Si no se proporciona, se usa uno genérico. */
	readonly errorMessage?: string;
	/** Valor para el atributo autocomplete del input. */
	readonly autocomplete: string;
	/** IDs adicionales para aria-describedby, separados por espacios. */
	readonly ariaDescribedBy?: string;
}

const ValidatedFormGroup = (props: ValidatedFormGroupProps): JSX.Element => {
	const {
		id,
		name,
		inputType = "text",
		inputToChange,
		validationFunction,
		value,
		message,
		errorMessage,
		autocomplete,
		ariaDescribedBy,
	} = props;
	// Estado para almacenar el mensaje de error de validación. `null` si es válido.
	const [validationError, setValidationError] = useState<string | null>(null);
	// ID único para el mensaje de error, para asociarlo con el input.
	const errorId = `${id}-error`;

	// Function that receives the information and updates it
	const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value: newValue } = event.target;
		inputToChange(newValue);
		const validationResult = validationFunction(newValue);
		// Si el resultado es `true`, la validación es correcta (sin error -> null).
		// Si es un `string`, es el mensaje de error.
		// Si es `false`, la validación falla, pero no hay mensaje específico,
		// así que usamos un string vacío para indicar el error y mostrar el mensaje genérico.
		setValidationError(
			validationResult === true ? null : validationResult || ""
		);
	};

	// Combina los IDs externos con el ID del error interno si es visible.
	const isInvalid = message && validationError !== null;
	const describedBy = [ariaDescribedBy, isInvalid ? errorId : null]
		.filter(Boolean)
		.join(" ");

	return (
		<Form.Group className="mb-3" controlId={id}>
			<Form.Label>{name}</Form.Label>
			<Form.Control
				type={inputType}
				onChange={nameChange}
				name={name}
				value={value}
				autoComplete={autocomplete}
				isInvalid={isInvalid}
				aria-describedby={describedBy || undefined}
			/>
			{isInvalid && (
				<Form.Control.Feedback
					type="invalid"
					id={errorId}
					className={`${styles.errorMessage} text-danger fw-bold mt-1`}
					// aria-live="polite" hace que los lectores de pantalla anuncien el mensaje de error cuando aparece, sin interrumpir al usuario.
					aria-live="polite"
				>
					{/* Si la validación retorna un string, lo muestra. Si no, usa el `errorMessage` de las props. */}
					{validationError || errorMessage || "Formato incorrecto."}
				</Form.Control.Feedback>
			)}
		</Form.Group>
	);
};

export default ValidatedFormGroup;
