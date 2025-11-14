import React, { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import ValidatedFormGroup from "../ValidatedFormGroup";
import {
	validateName,
	validateSurname,
	validatePhone,
	validateMail,
	validatePassword,
	validateSamePassword,
} from "../../validation/validations";
import { registerUser } from "../../services/authService";
import FormErrorAlert from "../FormErrorAlert";
import StyledButton from "../StyledButton";
import { useAuthFormHandler } from "../../hooks/useAuthFormHandler";
import styles from "./RegisterForm.module.css";
import { RegisterFormValues, FormFieldConfig } from "../../types";

/**
 * Estado inicial para el formulario de registro.
 */
const initialState: RegisterFormValues = {
	name: "",
	surname: "",
	phone: "",
	mail: "",
	password: "",
	samePassword: "",
};

/**
 * Componente de formulario de registro de usuario.
 */
const RegisterForm = () => {
	const [values, setValues] = useState<RegisterFormValues>(initialState);

	/**
	 * Maneja el cambio de los campos del formulario.
	 */
	const handleInputChange = (
		field: keyof RegisterFormValues,
		value: string
	) => {
		setValues((prev) => ({ ...prev, [field]: value }));
	};

	/**
	 * Verifica si el formulario es válido.
	 */
	const isFormValid = () => {
		return (
			validateName(values.name) === true &&
			validateSurname(values.surname) === true &&
			validatePhone(values.phone) === true &&
			validateMail(values.mail) === true &&
			validatePassword(values.password) === true &&
			validateSamePassword(values.password, values.samePassword) === true
		);
	};

	// Creamos la función de envío que el hook usará, encapsulando los valores del formulario.
	const apiSubmitFunction = () => {
		// Construimos el objeto justo antes de enviarlo para asegurar que tenemos los últimos valores.
		const authFormValues = {
			name: values.name,
			surname: values.surname,
			phone: values.phone,
			mail: values.mail,
			password: values.password,
			excursions: [], // Un nuevo usuario siempre empieza con un array de excursiones vacío.
		};
		return registerUser(authFormValues);
	};

	const { formState, formDispatch, handleSubmit } = useAuthFormHandler(
		isFormValid(),
		apiSubmitFunction,
		"/"
	);

	// Configuración de los campos del formulario para renderizarlos dinámicamente.
	const formFieldsConfig: FormFieldConfig<RegisterFormValues>[][] = [
		[
			{
				id: "formGridName",
				name: "Nombre",
				field: "name",
				validationFunction: validateName,
				autocomplete: "given-name",
				errorMessage: "El nombre no puede estar vacío.",
			},
			{
				id: "formGridSurname",
				name: "Apellidos",
				field: "surname",
				validationFunction: validateSurname,
				autocomplete: "family-name",
				errorMessage: "Los apellidos no pueden estar vacíos.",
			},
		],
		[
			{
				id: "formGridPhone",
				name: "Teléfono",
				field: "phone",
				inputType: "tel",
				validationFunction: validatePhone,
				autocomplete: "tel",
				errorMessage: "El formato del teléfono no es válido.",
			},
			{
				id: "formGridEmail",
				name: "Correo electrónico",
				field: "mail",
				inputType: "email",
				validationFunction: validateMail,
				autocomplete: "email",
				errorMessage: "El formato del correo electrónico no es válido.",
			},
		],
		[
			{
				id: "password",
				name: "Contraseña",
				field: "password",
				inputType: "password",
				validationFunction: validatePassword,
				autocomplete: "new-password",
				ariaDescribedBy: "password-requirements",
			},
			{
				id: "confirm-password",
				name: "Repite la contraseña",
				field: "samePassword",
				inputType: "password",
				// La validación de este campo depende del valor de la contraseña, por eso se define aquí.
				validationFunction: (value) =>
					validateSamePassword(values.password, value),
				autocomplete: "new-password",
			},
		],
	];

	const isButtonDisabled = !isFormValid();

	return (
		<>
			<FormErrorAlert
				error={formState.error}
				onClearError={() => formDispatch({ type: "CLEAR_ERROR" })}
			/>
			{/* Formulario de registro */}
			<Form
				id="registerForm"
				className={`${styles.formLabel} fw-bold`}
				aria-busy={formState.isLoading}
				onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
			>
				{formFieldsConfig.map((row, rowIndex) => (
					// eslint-disable-next-line react/no-array-index-key
					<Row key={`form-row-${rowIndex}`}>
						{row.map((field) => (
							<Col xs={12} md={6} key={field.id}>
								<ValidatedFormGroup
									{...field}
									value={values[field.field]}
									inputToChange={(value) =>
										handleInputChange(field.field, value)
									}
									message={true}
								/>
							</Col>
						))}
					</Row>
				))}
				{/* Mensaje informativo sobre los requisitos de la contraseña. */}
				<div
					id="password-requirements"
					className={`${styles.infoMessage} mb-3`}
				>
					<p className="mb-1 fw-normal">
						Tu contraseña debe contener al menos:
					</p>
					{/* ps-3 añade un poco de sangría a la lista para mejorar la legibilidad */}
					<ul className="mb-0 ps-3 fw-normal">
						<li>8 caracteres.</li>
						<li>Una letra.</li>
						<li>Un número.</li>
						<li>Un carácter especial (ej: @$!%*?&.,_-).</li>
					</ul>
				</div>

				<div className="d-grid d-sm-flex justify-content-sm-end">
					<StyledButton
						type="submit"
						variant={isButtonDisabled ? "secondary" : "primary"}
						isLoading={formState.isLoading}
						disabled={isButtonDisabled}
					>
						Enviar
					</StyledButton>
				</div>
			</Form>
		</>
	);
};

export default RegisterForm;
