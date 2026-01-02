import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { joinExcursion as joinExcursionService } from "../../services/excursionService";
import { updateUser } from "../../slices/loginSlice";
import { User } from "../../types";

/**
 * Guarda de tipo para validar que un objeto es de tipo User.
 */
function isUser(obj: unknown): obj is User {
	return (
		typeof obj === "object" &&
		obj !== null &&
		"mail" in obj &&
		"excursions" in obj
	);
}

export const useJoinExcursionAction = () => {
	const dispatch = useDispatch<AppDispatch>();
	// Obtenemos user y token directamente del store.
	// Al usarlos en el useCallback, aseguramos que la función se actualice si cambian.
	const { user, token } = useSelector((state: RootState) => state.loginReducer);

	const joinExcursion = useCallback(
		async (excursionId: string | number) => {
			if (!user?.mail || !token) {
				throw new Error("Usuario no autenticado o información faltante.");
			}

			const updatedUser = await joinExcursionService(
				user.mail,
				String(excursionId),
				token
			);

			if (isUser(updatedUser)) {
				dispatch(updateUser({ user: updatedUser }));
			} else {
				throw new Error("La respuesta de la API no tiene el formato esperado.");
			}
		},
		[user, token, dispatch]
	);

	return { joinExcursion };
};
