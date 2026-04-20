import React, { useEffect } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import UserPageInputEdit from "../UserPageInputEdit/UserPageInputEdit";
import {
	validateName,
	validateSurname,
	validatePhone,
} from "../../validation/validations";
import { useUserInfoForm, FormValues } from "./useUserInfoForm";
import CustomButton from "../../ui/CustomButton/CustomButton";
import { FeedbackAlert } from "../../ui/FeedbackAlert";
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

/**
 * Componente que se encarga del menú de edición y muestra de los datos del usuario logueado en ese momento
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

	const { values, isEditing, isLoading, error, successMessage } = formState;

	// Efecto para gestionar el foco. Cuando se entra en modo edición,
	// el foco se mueve automáticamente al primer campo editable (Nombre).
	useEffect(() => {
		if (isEditing) {
			// Usamos un pequeño timeout para asegurar que el input es visible y está listo para recibir el foco.
			const timer = setTimeout(() => nameInputRef.current?.focus(), 50);
			return () => clearTimeout(timer);
		}
	}, [isEditing, nameInputRef]);

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
						<FeedbackAlert
							variant="success"
							message={successMessage}
							onClose={clearMessages}
							className="mb-3"
						/>
					)}
					{isEditing && error && (
						<FeedbackAlert
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
								<CustomButton
									onClick={startEdit}
									className={`${styles.editButton} w-100`}
									variant="primary"
								>
									{/* Pasamos el icono y texto como children */}
									{/* StyledButton maneja el layout interno, pero podemos añadir un span para el gap */}
									<span className="d-flex align-items-center justify-content-center gap-2">
										Editar
									</span>
								</CustomButton>
							</Col>
						</Row>
					</div>
				)}
				{isEditing && (
					<div className="mt-auto pt-3">
						<Row className="justify-content-center justify-content-sm-end gx-2">
							{/* En xs, los botones ocupan el ancho completo y se apilan. En sm+, se muestran en línea. */}
							<Col xs={12} sm="auto" className="mb-2 mb-sm-0">
								<CustomButton
									variant="danger"
									onClick={cancelEdit}
									className={`${styles.cancelButton} w-100`}
								>
									<span className="d-flex align-items-center justify-content-center gap-2">
										Cancelar
									</span>
								</CustomButton>
							</Col>
							<Col xs={12} sm="auto">
								<CustomButton
									variant={
										!isFormValid || !isFormChanged ? "secondary" : "success"
									}
									onClick={saveEdit}
									className={`${styles.saveButton} w-100`}
									disabled={!isFormValid || !isFormChanged}
									isLoading={isLoading}
								>
									<span className="d-flex align-items-center justify-content-center gap-2">
										Guardar
									</span>
								</CustomButton>
							</Col>
						</Row>
					</div>
				)}
			</Card.Body>
		</Card>
	);
}
