import { useState, useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import {
	validateMail,
	validateName as isNotEmpty,
} from "../../validation/validations";
import { ROUTES, FORM_TEXT } from "../../constants";
import { ValidatedInput } from "../../ui/ValidatedInput/ValidatedInput";
import { Button } from "../../ui/Button";
import { Alert } from "../../ui/Alert";
import { loginUser } from "../../services/authService";
import { useAuthFormHandler } from "../../hooks/useAuthFormHandler";
import styles from "./LoginForm.module.css";

/**
 * Componente que representa el formulario de inicio de sesión.
 */
export function LoginForm() {
	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const emailInputRef = useRef<HTMLInputElement>(null);

	// Enfoca el campo de correo electrónico al cargar el componente.
	useEffect(() => {
		const timer = setTimeout(() => emailInputRef.current?.focus(), 0);
		return () => clearTimeout(timer);
	}, []);

	const formValues = { mail, password };

	/**
	 * Comprueba si el formulario es válido.
	 */
	const isFormValid = validateMail(mail) && isNotEmpty(password);

	// Utiliza el hook personalizado para manejar el estado del formulario y la lógica de envío.
	const {
		formState,
		formDispatch,
		handleSubmit: apiSubmit,
	} = useAuthFormHandler(isFormValid, () => loginUser(formValues), ROUTES.USER);

	/** Maneja el envío del formulario y activa la visibilidad de los mensajes de error. */
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitted(true);
		apiSubmit(event);
	};

	// Limpia el mensaje de error al cerrar la alerta.
	const handleClearError = () => {
		formDispatch({ type: "CLEAR_ERROR" });
	};

	return (
		<>
			{formState.error && (
				<Alert
					variant="danger"
					message={formState.error}
					onClose={handleClearError}
				/>
			)}
			<Form
				id="loginForm"
				noValidate
				aria-busy={formState.isLoading}
				onSubmit={handleSubmit}
				className={styles.formLabel}
			>
				<div className={styles.fieldsContainer}>
					<ValidatedInput
						ref={emailInputRef}
						id="formLoginEmail"
						name={FORM_TEXT.EMAIL_LABEL}
						inputType="email"
						inputToChange={setMail}
						validationFunction={validateMail}
						value={mail}
						message={isSubmitted}
						autocomplete="email"
						errorMessage={FORM_TEXT.INVALID_EMAIL_FORMAT}
					/>
					<ValidatedInput
						id="formLoginPassword"
						inputType="password"
						name={FORM_TEXT.PASSWORD_LABEL}
						inputToChange={setPassword}
						validationFunction={isNotEmpty}
						value={password}
						message={isSubmitted}
						autocomplete="current-password"
						errorMessage={FORM_TEXT.PASSWORD_CANNOT_BE_EMPTY}
					/>
				</div>
				<div className="d-grid d-sm-flex justify-content-sm-end">
					<Button
						type="submit"
						variant="primary"
						isLoading={formState.isLoading}
						/**
						 * Mantenemos el botón habilitado para permitir la validación visual al clicar
						 * (Mejora de accesibilidad WCAG AAA).
						 */
					>
						Enviar
					</Button>
				</div>
			</Form>
		</>
	);
}
