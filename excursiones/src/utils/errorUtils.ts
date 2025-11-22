import { GENERIC_ERROR_MESSAGE } from "../constants";

/**
 * Retorna un mensaje de error seguro para mostrar en la UI.
 * Si el error es un string, lo retorna. De lo contrario, retorna un mensaje genérico.
 * @param {unknown} error - El error capturado, cuyo tipo no se conoce.
 * @returns {string} - Un mensaje de error seguro.
 */
export const getSafeErrorMessage = (error: unknown): string => {
	return typeof error === "string" ? error : GENERIC_ERROR_MESSAGE;
};
