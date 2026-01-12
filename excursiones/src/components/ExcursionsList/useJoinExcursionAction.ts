import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { joinExcursion as joinExcursionService } from "../../services/excursionService";
import { updateUser } from "../../slices/loginSlice";
import { User } from "../../types";

/**
 * Este Custom Hook encapsula la lógica de negocio necesaria para que un usuario se apunte a una excursión.
 * Su objetivo principal es separar esta lógica de la interfaz de usuario (UI) en ExcursionsList.tsx,
 * siguiendo el principio de Separación de Responsabilidades.
 */

/**
 * Mensajes de error para la acción de unirse a una excursión.
 */
const ERROR_MESSAGES = {
	NOT_AUTHENTICATED: "Usuario no autenticado o información faltante.",
	INVALID_RESPONSE: "La respuesta de la API no tiene el formato esperado.",
};

/**
 * Guarda de tipo para validar que un objeto es de tipo User.
 */
function isUser(obj: unknown): obj is User {
	// Si no es un objeto o es null
	if (typeof obj !== "object" || obj === null) {
		return false;
	}
	// El objeto se convierte temporalmente a Record<string, unknown> para poder leer sus propeidades sin que el
	// compilador de problemas.
	const candidate = obj as Record<string, unknown>;

	// Validación exhaustiva del objeto hasta ahora desconocido.
	return (
		(typeof candidate.id === "string" || typeof candidate.id === "number") &&
		typeof candidate.name === "string" &&
		typeof candidate.surname === "string" &&
		typeof candidate.mail === "string" &&
		typeof candidate.phone === "string" &&
		Array.isArray(candidate.excursions) &&
		candidate.excursions.every(
			(id) => typeof id === "string" || typeof id === "number"
		)
	);
}

export const useJoinExcursionAction = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { user, token } = useSelector((state: RootState) => state.loginReducer);

	const joinExcursion = async (excursionId: string | number) => {
		// Si no hay usuario, correo o token se lanza un error
		if (!user?.mail || !token) {
			throw new Error(ERROR_MESSAGES.NOT_AUTHENTICATED);
		}
		// Si no hay error, se procede a actualizar al usuario con la nueva excursión
		const updatedUser = await joinExcursionService(
			user.mail,
			String(excursionId),
			token
		);
		// Si es un usuario correcto entonces se actualiza su información en la store
		if (isUser(updatedUser)) {
			dispatch(updateUser({ user: updatedUser }));
		} else {
			throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
		}
	};

	return { joinExcursion };
};
