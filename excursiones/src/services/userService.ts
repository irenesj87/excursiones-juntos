import { fetchApi } from "./authService";
import { User } from "../types";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

/**
 * Obtiene la información de un usuario por su ID.
 * @param id - El ID del usuario.
 * @param token - El token de autenticación.
 * @returns Los datos del usuario.
 */
export const getUserById = async (
	id: string | number,
	token: string,
): Promise<User> => {
	const url = `${API_BASE_URL}/users/${encodeURIComponent(id)}`;

	const options: RequestInit = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	return fetchApi<User>(url, options);
};

/**
 * Actualiza la información de un usuario.
 * @param mail - El correo del usuario a actualizar.
 * @param userData - Los datos del usuario a actualizar.
 * @param token - El token de autenticación.
 * @returns Los datos del usuario actualizados.
 */
export const updateUserInfo = async (
	mail: string,
	userData: Partial<User>,
	token: string,
): Promise<User> => {
	const url = `${API_BASE_URL}/users/${mail}`;
	const options: RequestInit = {
		method: "PUT",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		// Aseguramos que el correo en el cuerpo de la petición sea el correcto.
		body: JSON.stringify({ ...userData, mail }),
	};

	return fetchApi<User>(url, options);
};
