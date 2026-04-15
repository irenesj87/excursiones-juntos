import { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import { verifyToken } from "../services/authService";
import { AuthResponse } from "../types";
import { login, logout } from "../slices/loginSlice";
import { useMinDisplayTime } from "./useMinDisplayTime";

/**
 * Hook personalizado para verificar si un usuario ya tiene una sesión iniciada desde una visita anterior,
 * cuando la aplicación se carga por primera vez.
 * Este hook es necesario para evitar el problema del parpadeo, que da una mala experiencia de usuario.
 * Sin useAuth pasaría esto:
 * 1. Un usuario que ya ha iniciado sesión vuelve a tu web o refresca la página.
 * 2. La aplicación se carga. El estado de Redux está vacío al principio, por lo que la aplicación cree que el
 * usuario no está logueado.
 * 3. Durante un instante, la barra de navegación mostraría "Iniciar sesión".
 * 4. Un segundo después, algún código leería el token de sessionStorage, validaría la sesión y actualizaría el
 * estado.
 * 5. La barra de navegación "parpadearía" y cambiaría para mostrar "Tu perfil" y "Cerrar sesión".
 *   Si isAuthCheckComplete es:
 *   - `false`: La comprobación del token de sesión está en curso. La UI debería mostrar un estado de carga
 *     (skeleton) para evitar mostrar contenido incorrecto.
 *   - `true`: La comprobación ha finalizado. La aplicación ya sabe si el usuario está autenticado o no
 *     y puede renderizar de forma segura las rutas protegidas o redirigir a la página de login.
 */

/**
 * Estado inicial para el reducer de autenticación.
 * isAuthCheckComplete se establece inicialmente en false para indicar que la verificación de autenticación aún no
 * ha comenzado.
 */
const authInitialState: AuthState = {
	isAuthCheckComplete: false,
};

/**
 * Tipo de estado para el reducer de autenticación.
 * isAuthCheckComplete indica si la verificación de autenticación ha finalizado o no.
 */
interface AuthState {
	isAuthCheckComplete: boolean;
}

/**
 * Tipo de acciones para el reducer de autenticación.
 * - AUTH_START_CHECK: Indica que la verificación de autenticación ha comenzado.
 * - AUTH_CHECK_COMPLETE: Indica que la verificación de autenticación ha finalizado (con éxito o no).
 */
type AuthAction =
	| { type: "AUTH_START_CHECK" }
	| { type: "AUTH_CHECK_COMPLETE" };

/**
 * Reducer para manejar el estado de la autenticación del usuario.
 */
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
	switch (action.type) {
		// Cuando se recibe esta acción, se indica que la verificación de autenticación ha comenzado.
		case "AUTH_START_CHECK":
			return { ...state, isAuthCheckComplete: false };
		// Cuando se recibe esta acción, se indica que la verificación de autenticación ha finalizado (con éxito o no).
		case "AUTH_CHECK_COMPLETE":
			return { ...state, isAuthCheckComplete: true };
		default:
			return state;
	}
};

/**
 * Recupera el token de sesión de sessionStorage, buscando en la clave directao en el objeto de respaldo 'authState'.
 */
const getPersistedToken = (): string | null => {
	// Primero intentamos obtener el token directamente.
	const token = sessionStorage.getItem("token");
	// Si encontramos un token directo, se retorna inmediatamente.
	if (token) return token;
	// Si no hay un token directo, intentamos obtenerlo del objeto de respaldo 'authState'.
	const authState = sessionStorage.getItem("authState");
	// Si no hay un objeto de respaldo, se retorna null.
	if (!authState) return null;
	// Si hay un objeto de respaldo, intentamos parsearlo como JSON para extraer el token.
	try {
		const parsed = JSON.parse(authState);
		// Retornamos el token si existe, o null si no está presente en el objeto de respaldo.
		return parsed?.token || null;
	} catch (e) {
		console.warn("Error al recuperar token de authState:", e);
		return null;
	}
};

/**
 * Hook personalizado para manejar la autenticación del usuario.
 * Verifica el token de sessionStorage en la carga inicial de la aplicación y actualiza el estado de Redux.
 */
export const useAuth = () => {
	// useDispatch de Redux para despachar acciones de login y logout.
	const reduxDispatch = useDispatch();
	// useReducer para manejar el estado de autenticación local.
	const [state, authDispatch] = useReducer(authReducer, authInitialState);
	// useMinDisplayTime es un hook personalizado que maneja el tiempo mínimo de visualización de ciertos estados.
	// Se usa para evitar el parpadeo de la UI durante la verificación del estado de autenticación.
	// authDispatch se pasa para que pueda despachar acciones relacionadas con la autenticación.
	// startTiming inicia un temporizador para asegurar que la UI se muestre durante un tiempo mínimo.
	// dispatchWithMinDisplayTime despacha acciones con un tiempo mínimo de visualización.
	const { startTiming, dispatchWithMinDisplayTime } =
		useMinDisplayTime(authDispatch);

	useEffect(() => {
		// AbortController permite cancelar peticiones fetch si el efecto se vuelve a ejecutar
		// o el componente se desmonta, evitando carreras de condiciones de red.
		const controller = new AbortController();

		// Esta función se ejecuta una vez cuando el componente se monta por primera vez.
		const verifyAuthStatus = async () => {
			authDispatch({ type: "AUTH_START_CHECK" });
			// Inicia el temporizador para asegurar que el skeleton se muestre durante un tiempo mínimo.
			startTiming();
			// Recuperamos el token de sesión de sessionStorage.
			const sessionToken = getPersistedToken();

			// Si no hay token, no es necesario llamar al servidor. Limpiamos Redux y marcamos la comprobación como finalizada.
			if (!sessionToken) {
				// Si el componente ya no está montado, no hacemos nada.
				if (!controller.signal.aborted) {
					reduxDispatch(logout()); // Aseguramos que Redux esté limpio
					dispatchWithMinDisplayTime({ type: "AUTH_CHECK_COMPLETE" });
				}
				return;
			}
			// Si hay un token, verificamos su validez con el servidor.
			try {
				// Pasamos la señal del controlador al servicio para cancelar la petición de red si es necesario.
				const authData: AuthResponse | null = await verifyToken(
					sessionToken,
					controller.signal,
				);

				// Si la verificación es exitosa y el componente aún está montado, actualizamos el estado de Redux con los datos del usuario.
				if (!controller.signal.aborted && authData) {
					reduxDispatch(login({ user: authData.user, token: authData.token }));
				}
			} catch (error) {
				if ((error as Error).name === "AbortError") return;

				console.error(
					"Error en la verificación del estado de autenticación:",
					// Usamos error.message para un log más limpio, ya que el servicio ya formatea el error.
					(error as Error).message,
				);
				// Esto actualizará el estado de Redux para reflejar que el usuario no está autenticado.
				// Si el componente ya no está montado, no hacemos nada.
				if (!controller.signal.aborted) {
					reduxDispatch(logout());
				}
			} finally {
				// Finalmente, independientemente de si la verificación fue exitosa o fallida,
				// se despacha la acción de AUTH_CHECK_COMPLETE para indicar que la verificación ha terminado (isAuthCheckComplete a true).
				// Esto es importante para que la UI sepa que ya no está en un estado de carga.
				// Si el componente ya no está montado, no hacemos nada.
				if (!controller.signal.aborted) {
					dispatchWithMinDisplayTime({ type: "AUTH_CHECK_COMPLETE" });
				}
			}
		};
		// Llamamos a la función para verificar el estado de autenticación cuando el componente se monta.
		verifyAuthStatus();

		// Función de limpieza que se ejecuta al desmontar el componente (por ejemplo si el usuario cierra la pestaña).
		return () => {
			controller.abort();
		};
	}, [reduxDispatch, startTiming, dispatchWithMinDisplayTime, authDispatch]);

	return { isAuthCheckComplete: state.isAuthCheckComplete };
};
