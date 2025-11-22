import { AuthResponse, LoginCredentials, UserRegistration } from "../types";

/**
 * El servicio encapsula la lógica para interactuar con la API de autenticación.
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

/**
 * Realiza una petición fetch y maneja las respuestas de error comunes.
 */
export async function fetchApi<T>(
	url: string,
	options: RequestInit
): Promise<T> {
	const response = await fetch(url, options);

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		// Usamos un mapeo de estados a mensajes para errores conocidos.
		const errorMessages: Record<number, string> = {
			401: "Datos incorrectos. Inténtalo de nuevo.",
			409: "Ya hay un usuario registrado con ese correo. Elige otro.",
		};
		throw new Error(
			errorMessages[response.status] ||
				errorData.message ||
				`Error: ${response.status}`
		);
	}
	return response.json();
}

/**
 * Inicia sesión de un usuario.
 */
export const loginUser = async (
	credentials: LoginCredentials
): Promise<AuthResponse> => {
	const url = `${API_BASE_URL}/login`;
	const options: RequestInit = {
		method: "POST",
		mode: "cors",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(credentials),
	};

	return fetchApi<AuthResponse>(url, options);
};

/**
 * Registra un nuevo usuario.
 */
export const registerUser = async (
	userData: UserRegistration
): Promise<AuthResponse> => {
	const url = `${API_BASE_URL}/users`;
	const options: RequestInit = {
		method: "POST",
		mode: "cors",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(userData),
	};

	return fetchApi<AuthResponse>(url, options);
};

/**
 * Verifica el estado de autenticación de un usuario validando un token de sesión.
 */
export const verifyToken = async (
	token: string | null
): Promise<AuthResponse | null> => {
	if (!token) return null;

	const url = `${API_BASE_URL}/token/verify`;
	const options: RequestInit = {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
	};
	return fetchApi<AuthResponse>(url, options);
};

/**
 * Cierra la sesión del usuario en el cliente.
 * Esto implica eliminar el token de autenticación del almacenamiento de sesión.
 */
export const logoutUser = () => {
	// Eliminamos el token del almacenamiento de sesión para ser consistentes con el resto de la aplicación.
	sessionStorage.removeItem("token");
	// Con JWT, el logout es una operación 100% del lado del cliente. No es necesario hacer una llamada a la API.
};
