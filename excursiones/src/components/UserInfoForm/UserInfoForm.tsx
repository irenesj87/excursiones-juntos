import React from "react";
import { Card, Col, Form, Row, Button, Spinner, Alert } from "react-bootstrap";
import UserPageInputEdit from "../UserPageInputEdit/UserPageInputEdit";
import {
	validateName,
	validateSurname,
	validatePhone,
} from "../../validation/validations";
import { useUserInfoForm, FormValues } from "../../hooks/useUserInfoForm";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./UserInfoForm.module.css";

/**
 * Componente que se encarga del menú de edición y muestra de los datos del usuario logueado en ese momento
 */
function UserInfoForm(): React.ReactElement {
	const {
		formState,
		user,
		isFormValid,
		isFormChanged,
		startEdit,
		cancelEdit,
		saveEdit,
		handleInputChange,
		clearMessages,
		nameInputRef,
		alertRef,
	} = useUserInfoForm();

	const { values, isEditing, isLoading, error, successMessage } = formState;

	interface FormField {
		id: string;
		label: string;
		field: keyof FormValues;
		ref?: React.RefObject<HTMLInputElement>;
		validation: (value: string) => boolean;
		errorMessage: string;
	}

	// Configuración de los campos del formulario para renderizarlos dinámicamente.
	const formFields: FormField[] = [
		{
			id: "formPlaintextName",
			label: "Nombre",
			field: "name",
			ref: nameInputRef,
			validation: validateName,
			errorMessage: "El nombre no puede estar vacío y debe ser válido.",
		},
		{
			id: "formPlaintextSurname",
			label: "Apellidos",
			field: "surname",
			validation: validateSurname,
			errorMessage: "Los apellidos no pueden estar vacíos y deben ser válidos.",
		},
		{
			id: "formPlaintextPhone",
			label: "Teléfono",
			field: "phone",
			validation: validatePhone,
			errorMessage: "El formato del teléfono no es válido (9 dígitos).",
		},
	];

	// Determina el `aria-label` para el contenedor de la alerta.
	// Esto proporciona un nombre accesible al grupo de alertas, que es anunciado por los lectores de pantalla al enfocarlo.
	// Si hay un mensaje de éxito, se usa un label específico. Si hay un error y se está editando, se usa otro label.
	// Si no hay alertas, se deja undefined para que no interfiera con la accesibilidad.
	const alertContainerAriaLabel = (() => {
		if (successMessage) {
			return "Mensaje de éxito";
		}
		if (isEditing && error) {
			return "Mensaje de error";
		}
		return undefined;
	})();

	return (
		<Card className={`${styles.profileCard} w-100 flex-grow-1`}>
			<Card.Body className={`${styles.cardBody} d-flex flex-column`}>
				{/*
				 * Contenedor para alertas de éxito y error.
				 * - `role="group"` agrupa las alertas semánticamente.
				 * - `aria-label` proporciona un nombre accesible al grupo, que es anunciado por los lectores de pantalla al enfocarlo.
				 * - `ref` y `tabIndex={-1}` permiten que el contenedor sea enfocado programáticamente.
				 */}
				<fieldset ref={alertRef} tabIndex={-1} className="border-0 p-0 m-0">
					{alertContainerAriaLabel && (
						<legend className="visually-hidden">
							{alertContainerAriaLabel}
						</legend>
					)}
					{successMessage && (
						<Alert
							variant="success"
							onClose={clearMessages}
							dismissible
							className="mb-3"
						>
							{successMessage}
						</Alert>
					)}
					{isEditing && error && (
						<Alert
							variant="danger"
							onClose={clearMessages}
							dismissible
							className="mb-3"
						>
							{error}
						</Alert>
					)}
				</fieldset>

				{/* Campo de correo electrónico (sólo lectura) */}
				<Form.Group
					as={Row}
					className="mb-3 gx-2"
					controlId="formPlaintextEmail"
				>
					<Form.Label column sm="3" className="text-sm-end fw-bold">
						Correo:
					</Form.Label>
					<Col sm="9">
						<Form.Control plaintext readOnly defaultValue={user?.mail ?? ""} />
					</Col>
				</Form.Group>

				{/* Renderizado dinámico de los campos del formulario */}
				{formFields.map((field, index) => (
					<Form.Group
						as={Row}
						key={field.id}
						className={`${
							index === formFields.length - 1 ? "mb-4" : "mb-3"
						} gx-2 align-items-center`}
					>
						<Form.Label
							column
							sm="3"
							className="text-sm-end fw-bold"
							htmlFor={field.id}
						>
							{field.label}:
						</Form.Label>
						<Col sm="9">
							<UserPageInputEdit
								ref={field.ref}
								id={field.id}
								isEditing={isEditing}
								onInputChange={(value) => handleInputChange(field.field, value)}
								value={values[field.field]}
								validationFunction={field.validation}
								message={true}
								errorMessage={field.errorMessage}
							/>
						</Col>
					</Form.Group>
				))}

				{/* Botón "Editar" visible cuando no se está editando */}
				{!isEditing && (
					<div className="mt-auto pt-3">
						<Row className="justify-content-center justify-content-sm-end gx-0">
							<Col xs={12} sm="auto">
								<Button
									onClick={startEdit}
									className={`${styles.editButton} w-100`}
								>
									Editar
								</Button>
							</Col>
						</Row>
					</div>
				)}
				{isEditing && (
					<div className="mt-auto pt-3">
						<Row className="justify-content-center justify-content-sm-end gx-2">
							{/* En xs, los botones ocupan el ancho completo y se apilan. En sm+, se muestran en línea. */}
							<Col xs={12} sm="auto" className="mb-2 mb-sm-0">
								<Button
									variant="danger"
									onClick={cancelEdit}
									className={`${styles.cancelButton} w-100`}
								>
									Cancelar
								</Button>
							</Col>
							<Col xs={12} sm="auto">
								<Button
									variant={
										!isFormValid || !isFormChanged ? "secondary" : "success"
									}
									onClick={saveEdit}
									className={`${styles.saveButton} w-100`}
									aria-disabled={!isFormValid || !isFormChanged || isLoading}
								>
									{isLoading ? (
										<output>
											<Spinner
												as="span"
												animation="border"
												size="sm"
												aria-hidden="true"
											/>
										</output>
									) : (
										<>Guardar</>
									)}
								</Button>
							</Col>
						</Row>
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

export default UserInfoForm;
