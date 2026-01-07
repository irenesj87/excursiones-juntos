/**
 * Constantes globales de la aplicación.
 */
export const COMPANY_NAME = "Excursiones Juntos";
export const START_YEAR = 2021;
export const GENERIC_ERROR_MESSAGE =
	"Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde";
export const DIFFICULTY = "Dificultad";

/**
 * Array con los niveles de dificultad válidos.
 */
export const VALID_DIFFICULTY_LEVELS = ["Baja", "Media", "Alta"] as const;

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

/**
 * Constantes relacionadas con la API.
 */
export const API = {
	BASE_URL: "http://localhost:3001",
	STATIC_IMAGES_URL: "http://localhost:3001/images",
} as const;
