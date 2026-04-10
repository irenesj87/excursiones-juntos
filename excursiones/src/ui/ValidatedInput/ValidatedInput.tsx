import { useState, ChangeEvent, forwardRef, useRef } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import cn from "classnames";
import { EyeIcon, EyeOffIcon, TriangleAlertIcon } from "../Icons";
import styles from "./ValidatedInput.module.css";

/**
 * Propiedades del componente ValidatedInput.
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

/**
 * Componente de entrada validada que maneja tanto la validación en tiempo real como la validación perezosa.
 * Muestra mensajes de error solo después de que el usuario ha interactuado con el campo o ha intentado enviar el
 * formulario.
 * Se utiliza `forwardRef` para permitir que el componente padre pueda acceder al elemento input directamente,
 * lo que es necesario para que librerías de validación puedan interactuar con el campo correctamente.
 * También incluye una funcionalidad para mostrar/ocultar contraseñas si el tipo de input es "password".
 * @returns Un componente de formulario con validación integrada y accesibilidad mejorada.
 */
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
		// Estado para controlar la visibilidad de la contraseña.
		const [showPassword, setShowPassword] = useState(false);

		// Estado para rastrear si el campo ha sido "tocado" por el usuario, lo que es necesario para la validación perezosa.
		const [isTouched, setIsTouched] = useState(false);

		/**
		 * Ref para rastrear si el usuario ha interactuado físicamente con el campo.
		 * Esto es imprescindible para distinguir entre un "autofocus" del navegador (pasivo)
		 * y una acción real del usuario (activo).
		 */
		const wasManuallyInteracted = useRef(false);

		// ID único para el mensaje de error, para asociarlo con el input.
		const errorId = `${id}-error`;

		/** Registra una interacción manual (clic o teclado). */
		const handleManualInteraction = () => {
			wasManuallyInteracted.current = true;
		};

		/** Actualiza el valor en el padre y marca la interacción manual. */
		const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
			wasManuallyInteracted.current = true;
			inputToChange(event.target.value);
		};

		/**
		 * Al perder el foco, marcamos como "tocado" solo si el usuario interactuó
		 * o si el campo ya tiene contenido. Esto evita que el error "salte"
		 * al salir de una página donde el primer campo tenía autofocus.
		 */
		const handleBlur = () => {
			if (wasManuallyInteracted.current || value.trim() !== "") {
				setIsTouched(true);
			}
		};

		// Lógica derivada: La validez se calcula en cada render.
		const isValid = validationFunction(value) === true;

		/**
		 * Validación Perezosa: Mostramos error solo si la validación falla Y:
		 * - El formulario ha intentado enviarse (message === true).
		 * - O el usuario ha salido del campo al menos una vez (isTouched === true).
		 */
		const isInvalid = !isValid && (message || isTouched);

		// Mostramos el mensaje de error solo si hay un mensaje específico y el campo es inválido para
		// no renderizar contenedores de error vacíos.
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

		const controlElement = (
			<Form.Control
				ref={ref}
				type={currentType}
				onChange={nameChange}
				onBlur={handleBlur}
				onPointerDown={handleManualInteraction}
				onKeyDown={handleManualInteraction}
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
