import { useReducer, useEffect, useRef, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../slices/loginSlice";
import { AuthResponse } from "../types";

interface AuthFormState {
	isLoading: boolean;
	error: string | null;
	isButtonDisabled: boolean;
}

type AuthFormAction =
	| { type: "SUBMIT_START" }
	| { type: "SUBMIT_SUCCESS" }
	| { type: "SUBMIT_FAILURE"; payload: string }
	| { type: "SET_VALIDITY"; payload: boolean }
	| { type: "CLEAR_ERROR" };

const initialState: AuthFormState = {
	isLoading: false,
	error: null,
	isButtonDisabled: true,
};

/**
 * Reducer genérico para gestionar el estado de los formularios de autenticación.
 */
function authFormReducer(
	state: AuthFormState,
	action: AuthFormAction
): AuthFormState {
	switch (action.type) {
		case "SUBMIT_START":
			return { ...state, isLoading: true, error: null };
		case "SUBMIT_SUCCESS":
			return { ...state, isLoading: false };
		case "SUBMIT_FAILURE":
			return { ...state, isLoading: false, error: action.payload };
		case "SET_VALIDITY":
			return { ...state, isButtonDisabled: !(action.payload) };
		case "CLEAR_ERROR":
			return { ...state, error: null };
		default: {
			// TypeScript nos ayuda a asegurar que todos los casos están cubiertos.
			// Si llegamos aquí, es porque se ha pasado una acción no contemplada.
			// Incluimos el tipo de acción en el error para facilitar la depuración.
			const unhandledAction = /** @type {{type: string}} */ action;
			throw new Error(
				`Acción no soportada: ${(unhandledAction as AuthFormAction).type}`
			);
		}
	}
}

/**
 * Hook personalizado para manejar la lógica de los formularios de autenticación (login y registro).
 */
export function useAuthFormHandler(
	isFormValid: boolean,
	apiSubmitFunction: () => Promise<AuthResponse>,
	successRedirectPath: string
) {
	const loginDispatch = useDispatch();
	const navigate = useNavigate();
	const [formState, formDispatch] = useReducer(authFormReducer, initialState);

	// Usamos una referencia para mantener la función de validación actualizada sin causar re-renders.
	const apiSubmitFnRef = useRef(apiSubmitFunction);
	useEffect(() => {
		apiSubmitFnRef.current = apiSubmitFunction;
	}, [apiSubmitFunction]);

	// Efecto para validar el formulario cuando los valores cambian.
	useEffect(() => {
		formDispatch({ type: "SET_VALIDITY", payload: isFormValid });
	}, [isFormValid]);

	/**
	 * Maneja el envío del formulario.
	 */
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (formState.isButtonDisabled || formState.isLoading) {
			return;
		}
		formDispatch({ type: "SUBMIT_START" });

		try {
			const data = await apiSubmitFnRef.current();
			loginDispatch(login({ user: data.user, token: data.token }));
			sessionStorage.setItem("token", data.token);
			formDispatch({ type: "SUBMIT_SUCCESS" });
			navigate(successRedirectPath);
		} catch (error) {
			console.error("Fallo en la autenticación:", error);
			let errorMessage;
			if (error instanceof Error) {
				errorMessage = error.message;
			} else if (
				error instanceof TypeError &&
				error.message === "Failed to fetch"
			) {
				errorMessage =
					"No se pudo conectar con el servidor. Por favor, comprueba tu conexión e inténtalo de nuevo.";
			} else {
				errorMessage =
					(error as Error).message ||
					"Ocurrió un error inesperado. Inténtalo de nuevo.";
			}
			formDispatch({ type: "SUBMIT_FAILURE", payload: errorMessage });
		}
	};

	return { formState, formDispatch, handleSubmit };
}
