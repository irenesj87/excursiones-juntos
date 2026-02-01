import React, { useEffect } from "react";
import { Card, Col, Form, Row, Alert } from "react-bootstrap";
import UserPageInputEdit from "../UserPageInputEdit/UserPageInputEdit";
import {
	validateName,
	validateSurname,
	validatePhone,
} from "../../validation/validations";
import { useUserInfoForm, FormValues } from "./useUserInfoForm";
import StyledButton from "../StyledButton/StyledButton";
import {
	UserIcon,
	UsersIcon,
	PhoneIcon,
	MailIcon,
	EditIcon,
	XIcon,
	CheckIcon,
} from "../shared/Icons";
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
	icon: React.ComponentType<{ className?: string }>;
}

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

	// Efecto para gestionar el foco. Cuando se entra en modo edición,
	// el foco se mueve automáticamente al primer campo editable (Nombre).
	useEffect(() => {
		if (isEditing) {
			// Usamos un pequeño timeout para asegurar que el input es visible y está listo para recibir el foco.
			const timer = setTimeout(() => nameInputRef.current?.focus(), 50);
			return () => clearTimeout(timer);
		}
	}, [isEditing]);

	// Configuración de los campos del formulario para renderizarlos dinámicamente.
	const formFields: FormField[] = [
		{
			id: "formPlaintextName",
			label: "Nombre",
			field: "name",
			ref: nameInputRef,
			validation: validateName,
			errorMessage: "El nombre no puede estar vacío y debe ser válido.",
			icon: UserIcon,
		},
		{
			id: "formPlaintextSurname",
			label: "Apellidos",
			field: "surname",
			validation: validateSurname,
			errorMessage: "Los apellidos no pueden estar vacíos y deben ser válidos.",
			icon: UsersIcon,
		},
		{
			id: "formPlaintextPhone",
			label: "Teléfono",
			field: "phone",
			validation: validatePhone,
			errorMessage: "El formato del teléfono no es válido (9 dígitos).",
			icon: PhoneIcon,
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
						<h2 className={styles.formTitle}>Mi Perfil</h2>
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

				{/* Sección: Datos de Cuenta */}
				<div className="mb-4">
					<h3 className={styles.sectionTitle}>Cuenta</h3>
					<Form.Group
						as={Row}
						className="mb-0 gx-2 align-items-center"
						controlId="formPlaintextEmail"
					>
						<Form.Label column sm="3" className="text-sm-end fw-bold">
							<span className="d-flex align-items-center justify-content-sm-end gap-2">
								<MailIcon className={styles.labelIcon} aria-hidden="true" />
								<span className={styles.labelText}>Correo:</span>
							</span>
						</Form.Label>
						<Col sm="9">
							<Form.Control
								plaintext
								readOnly
								defaultValue={user?.mail ?? ""}
							/>
						</Col>
					</Form.Group>
				</div>

				<hr className="border-secondary-subtle my-4 opacity-25" />

				{/* Sección: Información Personal */}
				<div>
					<h3 className={styles.sectionTitle}>Información Personal</h3>

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
								<span className="d-flex align-items-center justify-content-sm-end gap-2">
									<field.icon className={styles.labelIcon} aria-hidden="true" />
									<span className={styles.labelText}>{field.label}:</span>
								</span>
							</Form.Label>
							<Col sm="9">
								<UserPageInputEdit
									ref={field.ref}
									id={field.id}
									isEditing={isEditing}
									onInputChange={(value) =>
										handleInputChange(field.field, value)
									}
									value={values[field.field]}
									validationFunction={field.validation}
									message={true}
									errorMessage={field.errorMessage}
								/>
							</Col>
						</Form.Group>
					))}
				</div>

				{/* Botón "Editar" visible cuando no se está editando */}
				{!isEditing && (
					<div className="mt-auto pt-3">
						<Row className="justify-content-center justify-content-sm-end gx-0">
							<Col xs={12} sm="auto">
								<StyledButton
									onClick={startEdit}
									className={`${styles.editButton} w-100`}
									variant="primary"
								>
									{/* Pasamos el icono y texto como children */}
									{/* StyledButton maneja el layout interno, pero podemos añadir un span para el gap */}
									<span className="d-flex align-items-center justify-content-center gap-2">
										<EditIcon aria-hidden="true" />
										Editar
									</span>
								</StyledButton>
							</Col>
						</Row>
					</div>
				)}
				{isEditing && (
					<div className="mt-auto pt-3">
						<Row className="justify-content-center justify-content-sm-end gx-2">
							{/* En xs, los botones ocupan el ancho completo y se apilan. En sm+, se muestran en línea. */}
							<Col xs={12} sm="auto" className="mb-2 mb-sm-0">
								<StyledButton
									variant="danger"
									onClick={cancelEdit}
									className={`${styles.cancelButton} w-100`}
								>
									<span className="d-flex align-items-center justify-content-center gap-2">
										<XIcon aria-hidden="true" />
										Cancelar
									</span>
								</StyledButton>
							</Col>
							<Col xs={12} sm="auto">
								<StyledButton
									variant={
										!isFormValid || !isFormChanged ? "secondary" : "success"
									}
									onClick={saveEdit}
									className={`${styles.saveButton} w-100`}
									disabled={!isFormValid || !isFormChanged}
									isLoading={isLoading}
								>
									<span className="d-flex align-items-center justify-content-center gap-2">
										<CheckIcon aria-hidden="true" />
										Guardar
									</span>
								</StyledButton>
							</Col>
						</Row>
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

export default UserInfoForm;
