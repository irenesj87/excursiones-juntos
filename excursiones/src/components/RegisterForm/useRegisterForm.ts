import { useState, useRef, useEffect } from "react";
import {
	validateName,
	validateSurname,
	validatePhone,
	validateMail,
	validatePassword,
	validateSamePassword,
} from "../../validation/validations";
import { registerUser } from "../../services/authService";
import { useAuthFormHandler } from "../../hooks/useAuthFormHandler";
import { ROUTES } from "../../constants";
import { RegisterFormValues, FormFieldConfig } from "../../types";

/**
 * Estado inicial del formulario de registro, con todos los campos vacíos. Esto se utiliza para inicializar el estado del hook.
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
 * Hook que encapsula la lógica de negocio y configuración del formulario de registro.
 */
export function useRegisterForm() {
	// El estado de los valores del formulario se maneja localmente dentro del hook para mantenerlo encapsulado.
	const [values, setValues] = useState<RegisterFormValues>(initialState);
	// Referencia al input de nombre para establecer el foco al cargar el formulario.
	const nameInputRef = useRef<HTMLInputElement>(null);

	/**
	 * Efecto que se ejecuta al montar el componente para establecer el foco en el campo de nombre.
	 * Utilizamos un setTimeout para asegurar que el DOM esté listo antes de intentar enfocar el input.
	 */
	useEffect(() => {
		const timer = setTimeout(() => nameInputRef.current?.focus(), 0);
		return () => clearTimeout(timer);
	}, []);

	const handleInputChange = (
		field: keyof RegisterFormValues,
		value: string,
	) => {
		setValues((prev) => ({ ...prev, [field]: value }));
	};

	/**
	 * Función que valida el formulario. Se utiliza para determinar si el botón de envío debe estar habilitado
	 * y para validar antes de enviar.
	 * @returns - Un booleano que indica si el formulario es válido o no.
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

	/**
	 * Función que se pasa a useAuthFormHandler para manejar el envío del formulario. Se encarga de llamar a la
	 * función de registro de usuario con los valores del formulario. Si el registro es exitoso, useAuthFormHandler
	 * se encargará de redirigir al usuario a la página de inicio.
	 * Si ocurre un error, useAuthFormHandler actualizará el estado del formulario para mostrar el mensaje de error.
	 * @param values - Los valores actuales del formulario que se enviarán a la función de registro.
	 * @returns - Una promesa que resuelve la respuesta del registro de usuario.
	 */
	const apiSubmitFunction = () => {
		const authFormValues = {
			...values,
			excursions: [],
		};
		return registerUser(authFormValues);
	};

	const { formState, formDispatch, handleSubmit } = useAuthFormHandler(
		isFormValid(),
		apiSubmitFunction,
		ROUTES.HOME,
	);

	// Se define la estrcutura visual del formulario.
	const formFieldsConfig: FormFieldConfig<RegisterFormValues>[][] = [
		[
			{
				id: "formGridName",
				name: "Nombre",
				field: "name",
				validationFunction: validateName,
				autocomplete: "given-name",
				errorMessage: "El nombre no puede estar vacío.",
				ref: nameInputRef,
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
				validationFunction: (val: string) =>
					validateSamePassword(values.password, val),
				autocomplete: "new-password",
				errorMessage:
					"Las contraseñas deben coincidir y cumplir los requisitos de seguridad (al menos 8 caracteres, una letra, un número y un símbolo).",
			},
		],
	];

	/**
	 * Retorna toda la información y funciones necesarias para manejar el formulario de registro, incluyendo los
	 * valores actuales, la configuración de los campos, el estado del formulario, las funciones para manejar
	 * cambios y envíos, y un booleano que indica si el botón de envío debe estar deshabilitado.
	 * El componente RegisterForm consume esta información para renderizar el formulario y manejar la interacción
	 * del usuario.
	 * @returns - Un objeto con toda la información y funciones necesarias para manejar el formulario de registro.
	 */
	return {
		values,
		formFieldsConfig,
		formState,
		formDispatch,
		handleSubmit,
		handleInputChange,
		isButtonDisabled: !isFormValid(),
	};
}
