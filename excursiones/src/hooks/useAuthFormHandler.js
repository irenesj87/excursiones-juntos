import * as React from "react";
import { useReducer, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { isEqual } from "lodash";
import { useNavigate } from "react-router-dom";
import { login } from "../slices/loginSlice";

/**
 * @typedef {object} AuthFormState
 * @property {boolean} isLoading - Indica si el formulario se está enviando.
 * @property {string | null} error - Almacena el mensaje de error si el envío falla.
 * @property {boolean} isButtonDisabled - Indica si el botón de envío debe estar deshabilitado.
 */

/**
 * @typedef {object} AuthResponse
 * @property {object} user - El objeto de usuario devuelto por la API.
 * @property {string} token - El token de autenticación.
 */

/**
 * @typedef {{type: 'SUBMIT_START' | 'SUBMIT_SUCCESS' | 'CLEAR_ERROR'} | {type: 'SUBMIT_FAILURE', payload: string} | {type: 'SET_VALIDITY', payload: boolean}} AuthFormAction
 */

/**
 * Estado inicial para el reducer del formulario de autenticación.
 * @type {AuthFormState}
 */
const initialState = {
	isLoading: false,
	error: null,
	isButtonDisabled: true,
};
/**
 * Reducer genérico para gestionar el estado de los formularios de autenticación.
 * @param {AuthFormState} state - El estado actual.
 * @param {AuthFormAction} action - La acción a despachar.
 * @returns {AuthFormState} - El nuevo estado.
 */
function authFormReducer(state, action) {
	switch (action.type) {
		case "SUBMIT_START":
			return { ...state, isLoading: true, error: null };
		case "SUBMIT_SUCCESS":
			return { ...state, isLoading: false };
		case "SUBMIT_FAILURE":
			return { ...state, isLoading: false, error: action.payload };
		case "SET_VALIDITY":
			return { ...state, isButtonDisabled: !action.payload };
		case "CLEAR_ERROR":
			return { ...state, error: null };
		default: {
			// TypeScript nos ayuda a asegurar que todos los casos están cubiertos.
			// Si llegamos aquí, es porque se ha pasado una acción no contemplada en AuthFormAction.
			const exhaustiveCheck = action;
			throw new Error(`Acción no soportada: ${exhaustiveCheck}`);
		}
	}
}

/**
 * Hook de efecto que solo se ejecuta si las dependencias han cambiado profundamente.
 * @param {() => void} callback - La función de efecto a ejecutar.
 * @param {React.DependencyList} dependencies - El array de dependencias.
 */
function useDeepCompareEffect(callback, dependencies) {
	/** @type {React.MutableRefObject<React.DependencyList | undefined>} */
	const currentDependenciesRef = useRef();

	if (!isEqual(currentDependenciesRef.current, dependencies)) {
		currentDependenciesRef.current = dependencies;
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(callback, [currentDependenciesRef.current]);
}

/**
 * Hook personalizado para manejar la lógica de los formularios de autenticación (login y registro).
 * @param {Record<string, string | number | boolean>} formValues - Objeto con los valores actuales de los campos del formulario.
 * @param {(values: Record<string, string | number | boolean>) => boolean} isFormValidFn - Función que recibe los valores y retorna si el formulario es válido.
 * @param {(...args: (string | number | boolean)[]) => Promise<AuthResponse>} apiSubmitFunction - La función del servicio a llamar para el envío (ej. loginUser, registerUser).
 * @param {string} successRedirectPath - La ruta a la que redirigir en caso de éxito.
 * @returns {{
 *  formState: AuthFormState,
 *  formDispatch: React.Dispatch<AuthFormAction>,
 *  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
 * }} - El estado del formulario, el dispatch del reducer y la función de manejo de envío.
 */
export function useAuthFormHandler(
	formValues,
	isFormValidFn,
	apiSubmitFunction,
	successRedirectPath
) {
	const loginDispatch = useDispatch();
	const navigate = useNavigate();
	const [formState, formDispatch] = useReducer(authFormReducer, initialState);

	// Usamos una referencia para mantener la función de validación actualizada sin causar re-renders.
	const isFormValidFnRef = useRef(isFormValidFn);
	useEffect(() => {
		isFormValidFnRef.current = isFormValidFn;
	});

	// Efecto para validar el formulario cuando los valores cambian.
	useDeepCompareEffect(() => {
		// Llamamos a la función de validación a través de la referencia.
		const isFormValid = isFormValidFnRef.current(formValues);
		formDispatch({ type: "SET_VALIDITY", payload: isFormValid });
	}, [formValues, isFormValidFnRef]);

	/**
	 * Maneja el envío del formulario.
	 * @param {React.FormEvent<HTMLFormElement>} e - El evento de envío del formulario.
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (formState.isButtonDisabled || formState.isLoading) {
			return;
		}
		formDispatch({ type: "SUBMIT_START" });

		try {
			const data = await apiSubmitFunction(...Object.values(formValues));
			loginDispatch(login({ user: data.user, token: data.token }));
			globalThis.sessionStorage.setItem("token", data.token);
			formDispatch({ type: "SUBMIT_SUCCESS" });
			navigate(successRedirectPath);
		} catch (error) {
			console.error("Fallo en la autenticación:", error);
			let errorMessage;
			if (error instanceof TypeError && error.message === "Failed to fetch") {
				errorMessage =
					"No se pudo conectar con el servidor. Por favor, comprueba tu conexión e inténtalo de nuevo.";
			} else {
				errorMessage =
					error.message || "Ocurrió un error inesperado. Inténtalo de nuevo.";
			}
			formDispatch({ type: "SUBMIT_FAILURE", payload: errorMessage });
		}
	};

	return { formState, formDispatch, handleSubmit };
}
