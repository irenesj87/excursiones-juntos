import { useReducer, useEffect, useRef } from "react";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { updateUserInfo as updateUserService } from "../../services/userService";
import { updateUserInfo } from "../../slices/loginSlice";
import {
	validateName,
	validateSurname,
	validatePhone,
} from "../../validation/validations";
import type { RootState, AppDispatch } from "../../store/store";

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/** Valores de los campos del formulario de usuario. */
export interface FormValues {
	/** Nombre del usuario. */
	name: string;
	/** Apellidos del usuario. */
	surname: string;
	/** Teléfono de contacto. */
	phone: string;
}

interface FormState {
	values: FormValues;
	originalValues: FormValues;
	isEditing: boolean;
	isLoading: boolean;
	error: string | null;
	successMessage: string | null;
}

type FormAction =
	| { type: "START_EDIT" }
	| { type: "CANCEL_EDIT" }
	| {
			type: "UPDATE_FIELD";
			payload: { field: keyof FormValues; value: string };
	}
	| { type: "SAVE_START" }
	| { type: "SAVE_SUCCESS" }
	| { type: "SAVE_FAILURE"; payload: string }
	| { type: "CLEAR_MESSAGES" }
	| { type: "RESET_FORM"; payload: FormValues };

const AUTO_DISMISS_DELAY = 5000;

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
				values: state.originalValues,
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
				isEditing: false,
			};
		default:
			return state;
	}
};

/**
 * Hook que gestiona la lógica de estado, validación y persistencia del formulario de perfil.
 *
 * @returns Un objeto con el estado del formulario, referencias para el foco y manejadores de eventos.
 */
export const useUserInfoForm = () => {
	const loginDispatch = useAppDispatch();
	const { user, token } = useAppSelector(
		(state: RootState) => state.loginReducer,
	);

	/** Referencia al input de nombre para gestionar el foco inicial al editar. */
	const nameInputRef = useRef<HTMLInputElement>(null);

	const getUserValues = () => ({
		name: user?.name ?? "",
		surname: user?.surname ?? "",
		phone: user?.phone ?? "",
	});

	const initialState: FormState = {
		values: getUserValues(),
		originalValues: getUserValues(),
		isEditing: false,
		isLoading: false,
		error: null,
		successMessage: null,
	};

	const [formState, formDispatch] = useReducer(formReducer, initialState);
	const { values, originalValues, isEditing, successMessage, error } =
		formState;

	/** Referencia al contenedor de alertas para mover el foco tras una acción. */
	const alertRef = useRef<HTMLFieldSetElement>(null);

	const isFormValid =
		validateName(values.name) &&
		validateSurname(values.surname) &&
		validatePhone(values.phone);

	const isFormChanged =
		JSON.stringify(values) !== JSON.stringify(originalValues);

	/** Activa el modo de edición. */
	const startEdit = () => formDispatch({ type: "START_EDIT" });
	/** Cancela la edición y restaura los valores originales. */
	const cancelEdit = () => formDispatch({ type: "CANCEL_EDIT" });

	/** Guarda los cambios realizados en el perfil del usuario. */
	const saveEdit = async () => {
		if (!isFormValid || !isFormChanged || formState.isLoading) return;
		if (!user || !token) {
			console.error(
				"No se puede actualizar: falta el email del usuario o el token.",
			);
			return;
		}

		formDispatch({ type: "SAVE_START" });
		try {
			const updatedUserData = await updateUserService(user.mail, values, token);
			loginDispatch(updateUserInfo({ user: { ...user, ...updatedUserData } }));
			formDispatch({ type: "SAVE_SUCCESS" });
		} catch (err: unknown) {
			console.error("Fallo al actualizar la información del usuario:", err);
			const detail = err instanceof Error ? err.message : "Error desconocido";
			formDispatch({
				type: "SAVE_FAILURE",
				payload: `No se pudo actualizar tu información. (Detalle: ${detail})`,
			});
		}
	};

	/** Maneja el cambio de valor en un campo específico. */
	const handleInputChange = (field: keyof FormValues, value: string) => {
		formDispatch({ type: "UPDATE_FIELD", payload: { field, value } });
	};

	/** Limpia los mensajes de éxito o error. */
	const clearMessages = () => formDispatch({ type: "CLEAR_MESSAGES" });

	useEffect(() => {
		const newValues = {
			name: user?.name ?? "",
			surname: user?.surname ?? "",
			phone: user?.phone ?? "",
		};
		if (JSON.stringify(newValues) !== JSON.stringify(originalValues)) {
			formDispatch({ type: "RESET_FORM", payload: newValues });
		}
	}, [user, originalValues]);

	// Gestión del foco: Cuando se empieza a editar, ponemos el foco en el nombre.
	useEffect(() => {
		if (isEditing) {
			// Pequeño retardo para asegurar que el input sea interactuable tras el cambio de estado de 'readOnly'
			const timer = setTimeout(() => nameInputRef.current?.focus(), 50);
			return () => clearTimeout(timer);
		}
		return undefined;
	}, [isEditing]);

	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(clearMessages, AUTO_DISMISS_DELAY);
			return () => clearTimeout(timer);
		}
	}, [successMessage]);

	useEffect(() => {
		if ((error || successMessage) && alertRef.current) alertRef.current.focus();
	}, [error, successMessage]);

	return {
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
	};
};
