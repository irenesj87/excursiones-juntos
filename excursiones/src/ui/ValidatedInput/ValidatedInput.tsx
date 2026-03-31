import { useState, ChangeEvent, forwardRef } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
import cn from "classnames";
import { EyeIcon, EyeOffIcon, TriangleAlertIcon } from "../Icons";
import styles from "./ValidatedInput.module.css";

/**
 * Propiedades para el componente ValidatedInput.
 */
interface ValidatedInputProps {
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

const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
	(props, ref) => {
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

		// Estado para saber si el usuario ha interactuado con el campo.
		// Esto evita mostrar errores antes de que el usuario empiece a escribir.
		const [touched, setTouched] = useState(false);

		// Estado para controlar la visibilidad de la contraseña
		const [showPassword, setShowPassword] = useState(false);

		// ID único para el mensaje de error, para asociarlo con el input.
		const errorId = `${id}-error`;

		/** Maneja el cambio en el input y marca el campo como tocado. */
		const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
			inputToChange(event.target.value);
			if (!touched) setTouched(true);
		};

		// Lógica derivada: La validez se calcula en cada render (optimizado por React Compiler).
		const isValid = validationFunction(value) === true;
		// Mostramos error solo si: el componente debe mostrar mensajes, ha sido tocado y no es válido.
		const isInvalid = message && touched && !isValid;
		const showErrorMessage = isInvalid && !!errorMessage;

		const describedBy = [ariaDescribedBy, isInvalid ? errorId : null]
			.filter(Boolean)
			.join(" ");

		// Determinamos si es un campo de contraseña y qué tipo mostrar realmente
		const isPasswordType = inputType === "password";
		const currentType = isPasswordType && showPassword ? "text" : inputType;

		const togglePasswordVisibility = () => {
			setShowPassword((prev) => !prev);
		};

		// Elementos comunes para evitar redundancia y cumplir con el principio DRY.
		const controlElement = (
			<Form.Control
				ref={ref}
				type={currentType}
				onChange={nameChange}
				name={name}
				value={value}
				autoComplete={autocomplete}
				isInvalid={isInvalid}
				aria-describedby={describedBy || undefined}
			/>
		);

		const feedbackElement = (
			<Form.Control.Feedback
				type="invalid"
				id={errorId}
				className={cn(
					styles.errorContainer,
					{ [styles.visible]: showErrorMessage },
					"text-danger fw-bold",
				)}
				aria-live="polite"
			>
				{showErrorMessage && (
					<div className={styles.errorContent}>
						<TriangleAlertIcon size={18} className={styles.errorIcon} />
						{errorMessage}
					</div>
				)}
			</Form.Control.Feedback>
		);

		return (
			<Form.Group className={cn(styles.inputContainer, "mb-3")} controlId={id}>
				<Form.Label>{name}</Form.Label>
				{isPasswordType ? (
					<InputGroup hasValidation>
						{controlElement}
						<Button
							variant="outline-secondary"
							className={styles.passwordToggle}
							onClick={togglePasswordVisibility}
							type="button"
							aria-label={
								showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
							}
						>
							{showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
						</Button>
						{feedbackElement}
					</InputGroup>
				) : (
					<>
						{controlElement}
						{feedbackElement}
					</>
				)}
			</Form.Group>
		);
	},
);

ValidatedInput.displayName = "ValidatedInput";

export default ValidatedInput;
