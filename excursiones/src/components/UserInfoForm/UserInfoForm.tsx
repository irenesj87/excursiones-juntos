import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { UserPageInputEdit } from "../UserPageInputEdit/UserPageInputEdit";
import {
	validateName,
	validateSurname,
	validatePhone,
} from "../../validation/validations";
import { useUserInfoForm, FormValues } from "./useUserInfoForm";
import { Button } from "../../ui/Button";
import { Alert } from "../../ui/Alert";
import { UserIcon } from "../../ui/Icons";
import styles from "./UserInfoForm.module.css";

/**
 * Definición de los campos del formulario.
 */
interface FormField {
	id: string;
	label: string;
	field: keyof FormValues;
	ref?: React.RefObject<HTMLInputElement>;
	validation: (value: string) => boolean;
	errorMessage: string;
}

/** Configuración estática de los campos del formulario para evitar re-creaciones en cada render. */
const getFormFields = (
	nameInputRef: React.RefObject<HTMLInputElement>,
): FormField[] => [
	{
		id: "formPlaintextName",
		label: "Nombre",
		field: "name",
		ref: nameInputRef,
		validation: validateName,
		errorMessage: "El nombre no puede estar vacío.",
	},
	{
		id: "formPlaintextSurname",
		label: "Apellidos",
		field: "surname",
		validation: validateSurname,
		errorMessage: "Los apellidos no pueden estar vacíos.",
	},
	{
		id: "formPlaintextPhone",
		label: "Teléfono",
		field: "phone",
		validation: validatePhone,
		errorMessage: "El formato del teléfono no es válido (9 dígitos).",
	},
];

/**
 * Componente de interfaz para la gestión del perfil de usuario.
 *
 * Presenta la información de la cuenta y permite la edición de datos personales con validación en tiempo real y
 * gestión de errores.
 */
export function UserInfoForm(): React.ReactElement {
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

	/**
	 * Desestructuramos el estado del formulario para facilitar su uso en el JSX.
	 * Esto incluye los valores actuales del formulario, el estado de edición, carga, y cualquier mensaje de error o éxito.
	 */
	const { values, isEditing, isLoading, error, successMessage } = formState;

	/**
	 * Obtenemos los campos del formulario.
	 * Al usar la referencia del hook, mantenemos el control del foco centralizado.
	 */
	const formFields = getFormFields(nameInputRef);

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
				{/* Cabecera del perfil con foto y título */}
				<div className="d-flex flex-column flex-sm-row align-items-center gap-3 gap-sm-4 mb-4">
					<div className={styles.profileImageContainer}>
						<UserIcon
							size={48}
							className={styles.profilePlaceholderIcon}
							aria-hidden="true"
						/>
					</div>
					<div className="text-center text-sm-start">
						<h2 className={styles.formTitle}>Mi perfil</h2>
						<p className={styles.formDescription}>
							Gestiona tu información personal y de contacto.
						</p>
					</div>
				</div>

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
							message={successMessage}
							onClose={clearMessages}
							className="mb-3"
						/>
					)}
					{isEditing && error && (
						<Alert
							variant="danger"
							message={error}
							onClose={clearMessages}
							className="mb-3"
						/>
					)}
				</fieldset>

				{/* Sección: Datos de Cuenta */}
				<div className="mb-4">
					<h3 className={styles.sectionTitle}>Cuenta</h3>
					<Form.Group controlId="formPlaintextEmail" className="mb-0">
						<Form.Label className={styles.labelStacked}>Correo</Form.Label>
						<Form.Control
							plaintext
							readOnly
							value={user?.mail ?? ""}
							className={styles.readonlyEmail}
						/>
					</Form.Group>
				</div>

				<hr className="border-secondary-subtle my-4 opacity-25" />

				{/* Sección: Información Personal */}
				<div>
					<h3 className={styles.sectionTitle}>Información Personal</h3>

					{/* Renderizado dinámico de los campos del formulario */}
					{formFields.map((field, index) => (
						<Form.Group
							key={field.id}
							className={index === formFields.length - 1 ? "mb-4" : "mb-3"}
						>
							<Form.Label htmlFor={field.id} className={styles.labelStacked}>
								{field.label}
							</Form.Label>
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
						</Form.Group>
					))}
				</div>

				{/* Botón "Editar" visible cuando no se está editando */}
				{!isEditing && (
					<div className="mt-auto pt-3">
						<Row className="justify-content-center justify-content-sm-end gx-0">
							<Col xs={12} sm="auto">
								<Button
									onClick={startEdit}
									className={`${styles.editButton} w-100`}
									variant="primary"
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
									disabled={!isFormValid || !isFormChanged}
									isLoading={isLoading}
								>
									Guardar
								</Button>
							</Col>
						</Row>
					</div>
				)}
			</Card.Body>
		</Card>
	);
}
