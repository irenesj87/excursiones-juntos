import React, { useReducer, useEffect, useRef } from "react";
import { Card, Col, Form, Row, Button, Spinner, Alert } from "react-bootstrap";
import UserPageInputEdit from "../UserPageInputEdit/UserPageInputEdit";
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import { updateUserInfo } from "../../services/userService";
import { updateUser } from "../../slices/loginSlice";
import {
	validateName,
	validateSurname,
	validatePhone,
} from "../../validation/validations";
import type { RootState, AppDispatch } from "../../store/store"; // Asumiendo que tienes estos tipos en tu store
import "bootstrap/dist/css/bootstrap.css";
import styles from "./UserInfoForm.module.css";

// Hooks tipados de Redux para mayor seguridad de tipos
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Tipos y estados para el reducer del formulario
 */
interface FormValues {
	name: string;
	surname: string;
	phone: string;
}

/**
 * Estado del formulario de información del usuario.
 */
interface FormState {
	values: FormValues;
	originalValues: FormValues;
	isEditing: boolean;
	isLoading: boolean;
	error: string | null;
	successMessage: string | null;
}

/**
 * Acciones para el reducer del formulario.
 */
type FormAction =
	| { type: "START_EDIT" }
	| { type: "CANCEL_EDIT" } // Corregida la mezcla de espacios y tabulaciones
	| {
			type: "UPDATE_FIELD";
			payload: { field: keyof FormValues; value: string };
	}
	| { type: "SAVE_START" }
	| { type: "SAVE_SUCCESS" }
	| { type: "SAVE_FAILURE"; payload: string }
	| { type: "CLEAR_MESSAGES" }
	| { type: "RESET_FORM"; payload: FormValues };

/**
 * Componente que se encarga del menú de edición y muestra de los datos del usuario logueado en ese momento
 */
const UserInfoForm = () => {
	// Variable que necesitamos para poder usar los dispatchers de Redux.
	const loginDispatch = useAppDispatch();
	// Este useSelector nos da los datos del usuario actual.
	const { user, token } = useAppSelector(
		(state: RootState) => state.loginReducer
	);

	// Estado inicial para el reducer del formulario
	const initialState: FormState = {
		values: {
			name: user?.name ?? "",
			surname: user?.surname ?? "",
			phone: user?.phone ?? "",
		},
		originalValues: {
			name: user?.name ?? "",
			surname: user?.surname ?? "",
			phone: user?.phone ?? "",
		},
		isEditing: false,
		isLoading: false,
		error: null,
		successMessage: null,
	};

	/**
	 * Reducer para gestionar el estado del formulario de información del usuario.
	 */
	const formReducer = (state: FormState, action: FormAction): FormState => {
		switch (action.type) {
			case "START_EDIT":
				return {
					...state,
					isEditing: true,
					error: null,
					successMessage: null,
				};
			case "CANCEL_EDIT":
				return {
					...state,
					isEditing: false,
					values: state.originalValues, // Restaura los valores originales
					error: null,
					successMessage: null,
				};
			case "UPDATE_FIELD":
				return {
					...state,
					values: {
						...state.values,
						[action.payload.field]: action.payload.value,
					},
				};
			case "SAVE_START":
				return { ...state, isLoading: true, error: null, successMessage: null };
			case "SAVE_SUCCESS":
				return {
					...state,
					isEditing: false,
					isLoading: false,
					successMessage: "¡Datos guardados con éxito!",
				};
			case "SAVE_FAILURE":
				return { ...state, isLoading: false, error: action.payload };
			case "CLEAR_MESSAGES":
				return { ...state, error: null, successMessage: null };
			case "RESET_FORM":
				return {
					...state,
					values: action.payload,
					originalValues: action.payload,
					isEditing: false, // Resetea también el modo edición
				};
			default:
				return state;
		}
	};

	const [formState, formDispatch] = useReducer(formReducer, initialState);
	const {
		values,
		originalValues,
		isEditing,
		isLoading,
		error,
		successMessage,
	} = formState;

	const nameInputRef = useRef<HTMLInputElement>(null);
	const alertRef = useRef<HTMLFieldSetElement | null>(null);

	// Comprueba si el formulario es válido.
	const isFormValid =
		validateName(values.name) &&
		validateSurname(values.surname) &&
		validatePhone(values.phone);

	// Comprueba si el formulario ha cambiado.
	const isFormChanged =
		JSON.stringify(values) !== JSON.stringify(originalValues);

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

	/**
	 * Inicia el modo de edición del formulario.
	 */
	const startEdit = () => {
		formDispatch({ type: "START_EDIT" });
	};

	/**
	 * Cancela el modo de edición y restaura los valores originales del formulario.
	 */
	const cancelEdit = () => {
		formDispatch({ type: "CANCEL_EDIT" });
	};

	/**
	 * Guarda la información del usuario en el servidor. Realiza una petición PUT para actualizar los datos del usuario.
	 */
	const saveEdit = async () => {
		// Guarda para prevenir envíos múltiples si el botón está deshabilitado.
		if (!isFormValid || !isFormChanged || isLoading) {
			return;
		}

		// Comprobación de seguridad para asegurar que user.mail y token no son nulos/undefined
		if (!user || !token) {
			console.error(
				"No se puede actualizar: falta el email del usuario o el token."
			);
			return;
		}

		formDispatch({ type: "SAVE_START" });
		try {
			const updatedUserData = await updateUserInfo(user.mail, values, token);
			// Actualiza el estado de Redux con los nuevos datos del usuario.
			loginDispatch(
				updateUser({
					// Se fusiona el usuario existente con los datos actualizados para asegurar un objeto User completo.
					user: { ...user, ...updatedUserData },
				})
			);
			formDispatch({ type: "SAVE_SUCCESS" });
		} catch (err: unknown) {
			// Log the error for debugging and include a user-friendly message in the UI.
			console.error("Fallo al actualizar la información del usuario:", err);
			// Extrae un mensaje de error seguro para mostrar en la UI.
			const detail = err instanceof Error ? err.message : "Error desconocido";
			formDispatch({
				type: "SAVE_FAILURE",
				payload:
					"No se pudo actualizar tu información. Por favor, comprueba tu conexión o inténtalo de nuevo más tarde." +
					` (Detalle: ${detail})`,
			});
		}
	};

	/**
	 * Maneja el cambio de valor en un campo del formulario.
	 */
	const handleInputChange = (field: keyof FormValues, value: string) => {
		formDispatch({ type: "UPDATE_FIELD", payload: { field, value } });
	};

	// Efecto para sincronizar el estado del formulario si el usuario de Redux cambia.
	// Esto es crucial si los datos del usuario se cargan de forma asíncrona después del montaje inicial.
	useEffect(() => {
		const newValues = {
			name: user?.name ?? "",
			surname: user?.surname ?? "",
			phone: user?.phone ?? "",
		};
		// Solo actualiza si los valores son diferentes para evitar bucles de renderizado.
		if (JSON.stringify(newValues) !== JSON.stringify(originalValues)) {
			formDispatch({ type: "RESET_FORM", payload: newValues });
		}
		// La dependencia de `originalValues` es importante para evitar re-sincronizaciones innecesarias
		// si el usuario edita y cancela, volviendo a los valores originales que ya coinciden con `user`.
	}, [user, originalValues]);

	// Efecto para enfocar el primer input al entrar en modo edición.
	useEffect(() => {
		if (isEditing && nameInputRef.current) {
			nameInputRef.current.focus();
		}
	}, [isEditing]);

	// Efecto para auto-descartar el mensaje de éxito después de 5 segundos.
	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(() => {
				formDispatch({ type: "CLEAR_MESSAGES" });
			}, 5000); // 5 segundos

			// Limpia el temporizador si el componente se desmonta o el mensaje se descarta manualmente.
			return () => clearTimeout(timer);
		}
	}, [successMessage]);

	// Efecto para enfocar las alertas cuando aparecen.
	useEffect(() => {
		if ((error || successMessage) && alertRef.current) {
			alertRef.current.focus();
		}
	}, [error, successMessage]);

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
			<Card.Header as="h3" className={styles.cardHeader}>
				Datos Personales
			</Card.Header>
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
							onClose={() => formDispatch({ type: "CLEAR_MESSAGES" })}
							dismissible
							className="mb-3"
						>
							{successMessage}
						</Alert>
					)}
					{isEditing && error && (
						<Alert
							variant="danger"
							onClose={() => formDispatch({ type: "CLEAR_MESSAGES" })}
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
