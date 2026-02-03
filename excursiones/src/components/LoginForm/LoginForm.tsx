import React, { useState, useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import {
	validateMail,
	validateName as isNotEmpty,
} from "../../validation/validations";
import { ROUTES, FORM_TEXT } from "../../constants";
import ValidatedFormGroup from "../../ui/Input/ValidatedInput";
import FeedbackAlert from "../../ui/FeedbackAlert/FeedbackAlert";
import Button from "../../ui/Button/Button";
import { loginUser } from "../../services/authService";
import { useAuthFormHandler } from "../../hooks/useAuthFormHandler";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./LoginForm.module.css";

/**
 * Componente que representa el formulario de inicio de sesión.
 */
export function LoginForm() {
	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");
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

	const { formState, formDispatch, handleSubmit } = useAuthFormHandler(
		isFormValid,
		() => loginUser(formValues),
		ROUTES.USER,
	);

	return (
		<>
			{formState.error && (
				<FeedbackAlert
					variant="danger"
					message={formState.error}
					onClose={() => formDispatch({ type: "CLEAR_ERROR" })}
				/>
			)}
			<Form
				id="loginForm"
				noValidate
				aria-busy={formState.isLoading}
				onSubmit={handleSubmit}
				className={`${styles.formLabel} fw-bold`}
			>
				<div className={styles.fieldsContainer}>
					<ValidatedFormGroup
						ref={emailInputRef}
						id="formLoginEmail"
						name={FORM_TEXT.EMAIL_LABEL}
						inputType="email"
						inputToChange={setMail}
						validationFunction={validateMail}
						value={mail}
						message={true}
						autocomplete="email"
						errorMessage={FORM_TEXT.INVALID_EMAIL_FORMAT}
					/>
					<ValidatedFormGroup
						id="formLoginPassword"
						inputType="password"
						name={FORM_TEXT.PASSWORD_LABEL}
						inputToChange={setPassword}
						validationFunction={isNotEmpty}
						value={password}
						message={true}
						autocomplete="current-password"
						errorMessage={FORM_TEXT.PASSWORD_CANNOT_BE_EMPTY}
					/>
				</div>
				<div className="d-grid d-sm-flex justify-content-sm-end">
					<Button
						type="submit"
						variant={formState.isButtonDisabled ? "secondary" : "primary"}
						isLoading={formState.isLoading}
						disabled={formState.isButtonDisabled}
					>
						Enviar
					</Button>
				</div>
			</Form>
		</>
	);
}

export default LoginForm;
