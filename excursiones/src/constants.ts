/**
 * Constantes globales de la aplicación.
 * Centralizar estas constantes en un solo lugar mejora la mantenibilidad y asegura la consistencia en el proyecto.
 */
export const COMPANY_NAME = "Excursiones Juntos";
export const START_YEAR = 2021;
export const GENERIC_ERROR_MESSAGE = "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde";

/**
 * Rutas de la aplicación.
 */
export const ROUTES = {
	HOME: "/",
	LOGIN: "/loginPage",
	REGISTER: "/registerPage",
	USER: "/userPage",
} as const;

/**
 * Textos utilizados en formularios y páginas.
 */
export const FORM_TEXT = {
	EMAIL_LABEL: "Correo electrónico",
	PASSWORD_LABEL: "Contraseña",
	INVALID_EMAIL_FORMAT: "El formato del correo electrónico no es válido.",
	PASSWORD_CANNOT_BE_EMPTY: "La contraseña no puede estar vacía.",
} as const;

/**
 * Textos específicos para la página de inicio de sesión.
 */
export const LOGIN_PAGE_TEXT = {
	TITLE: "Inicia sesión",
	SUBTITLE: "Nos alegra verte de nuevo.",
	SWITCHER_PROMPT: "¿No tienes una cuenta?",
	SWITCHER_LINK_TEXT: "Regístrate",
} as const;
