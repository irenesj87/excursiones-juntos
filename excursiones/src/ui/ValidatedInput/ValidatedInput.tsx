import { useState, ChangeEvent, forwardRef } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
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

export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
	(
		{
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
		},
		ref,
	) => {
		// Estado para controlar la visibilidad de la contraseña y si el campo ha recibido el foco alguna vez.
		const [showPassword, setShowPassword] = useState(false);
		const [wasFocused, setWasFocused] = useState(false);

		// ID único para el mensaje de error, para asociarlo con el input.
		const errorId = `${id}-error`;

		/** Maneja el cambio en el input y marca que el usuario ya ha interactuado. */
		const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
			setWasFocused(true);
			inputToChange(event.target.value);
		};

		/** Marca el campo como enfocado al perder el foco para validar campos vacíos que el usuario ignoró. */
		const handleBlur = () => {
			setWasFocused(true);
		};

		// Lógica derivada: La validez se calcula en cada render (optimizado por React Compiler).
		const isValid = validationFunction(value) === true;
		/**
		 * Mostramos error solo si:
		 * 1. La validación falla Y...
		 * 2. Se ha intentado enviar el formulario (message === true)
		 *    O el usuario ha interactuado con el campo Y este no está vacío (Lazy Validation limpia).
		 */
		const isInvalid =
			!isValid && (message || (wasFocused && value.trim() !== ""));

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
				onBlur={handleBlur}
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
				className={cn(styles.errorContainer, {
					[styles.visible]: showErrorMessage,
				})}
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
