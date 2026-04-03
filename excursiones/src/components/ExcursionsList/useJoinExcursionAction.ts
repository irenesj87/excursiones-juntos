import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { joinExcursion as joinExcursionService } from "../../services/excursionService.ts";
import { updateUser } from "../../slices/loginSlice.ts";
import { userSchema } from "../../schemas/userSchema.ts";

/**
 * Este Custom Hook encapsula la lógica de negocio necesaria para que un usuario se apunte a una excursión.
 */

/**
 * Mensajes de error para la acción de unirse a una excursión.
 */
const ERROR_MESSAGES = {
	NOT_AUTHENTICATED: "Usuario no autenticado o información faltante.",
	INVALID_RESPONSE: "La respuesta de la API no tiene el formato esperado.",
};

export const useJoinExcursionAction = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { user, token } = useSelector((state: RootState) => state.loginReducer);

	const joinExcursion = async (excursionId: string | number) => {
		// Si no hay usuario o token se lanza un error
		if (!user || !token) {
			throw new Error(ERROR_MESSAGES.NOT_AUTHENTICATED);
		}

		// Validamos el usuario actual con Zod antes de usar sus datos.
		const validUser = userSchema.parse(user);

		/**
		 * Comprobación para evitar llamadas innecesarias a la API si el usuario ya está apuntado.
		 */
		const isAlreadyJoined = validUser.excursions.some(
			(id) => String(id) === String(excursionId),
		);

		if (isAlreadyJoined) {
			// Si el usuario ya está apuntado, no hacemos nada. La acción se considera completada.
			if (process.env.NODE_ENV === "development") {
				console.warn(
					`Intento de unirse a una excursión ya apuntada (ID: ${excursionId}). Acción omitida.`,
				);
			}
			return;
		}

		// Si no hay error, se procede a actualizar al usuario con la nueva excursión
		const updatedUserFromApi = await joinExcursionService(
			validUser.mail,
			String(excursionId),
			token,
		);

		// Validamos la respuesta de la API otra vez con Zod. Se hace para asegurarnos de que los datos que recibimos
		// son correctos y cumplen con el esquema definido, ya que la API podría tener un bug, estar en mantenimiento
		// o retornar datos inesperados. Con eso, se evita guardar datos corruptos o mal formados en Redux.
		// .parse() lanza un error si la validación falla, que será capturado por el catch del hook superior.
		// Si tiene éxito, retorna el objeto tipado y validado.
		const validatedUser = userSchema.parse(updatedUserFromApi);
		dispatch(updateUser({ user: validatedUser }));
	};

	return { joinExcursion };
};
