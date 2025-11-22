import React, { useState } from "react";
import { Form } from "react-bootstrap";
import {
	validateMail,
	validateName as isNotEmpty,
} from "../../validation/validations";
import { ROUTES, FORM_TEXT } from "../../constants";
import ValidatedFormGroup from "../ValidatedFormGroup";
import FormErrorAlert from "../FormErrorAlert";
import StyledButton from "../StyledButton";
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

	const formValues = { mail, password };

	/**
	 * Comprueba si el formulario es válido.
	 */
	const isFormValid = validateMail(mail) && isNotEmpty(password);

	const { formState, formDispatch, handleSubmit } = useAuthFormHandler(
		isFormValid,
		() => loginUser(formValues),
		ROUTES.USER
	);

	return (
		<>
			<FormErrorAlert
				error={formState.error}
				onClearError={() => formDispatch({ type: "CLEAR_ERROR" })}
			/>
			<Form
				id="loginForm"
				noValidate
				aria-busy={formState.isLoading}
				onSubmit={handleSubmit}
				className={`${styles.formLabel} fw-bold`}
			>
				<ValidatedFormGroup
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
				<div className="d-grid d-sm-flex justify-content-sm-end">
					<StyledButton
						type="submit"
						variant={formState.isButtonDisabled ? "secondary" : "primary"}
						isLoading={formState.isLoading}
						disabled={formState.isButtonDisabled}
					>
						Enviar
					</StyledButton>
				</div>
			</Form>
		</>
	);
}

export default LoginForm;
