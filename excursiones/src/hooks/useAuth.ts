import { useEffect, useReducer } from "react";
import { useDispatch } from "react-redux";
import { verifyToken } from "../services/authService";
import { AuthResponse } from "../types";
import { login, logout } from "../slices/loginSlice";
import { useMinDisplayTime } from "./useMinDisplayTime";

/**
 * Hook personalizado para verificar si un usuario ya tiene una sesión iniciada desde una visita anterior,
 * justo cuando la aplicación se carga por primera vez.
 * Este hook es necesario para evitar el problema del parpadeo, que da una mala experiencia de usuario.
 * Sin useAuth pasaría esto:
 * 1. Un usuario que ya ha iniciado sesión vuelve a tu web o refresca la página.
 * 2. La aplicación se carga. El estado de Redux está vacío al principio, por lo que la aplicación cree que el
 * usuario no está logueado.
 * 3. Durante un instante, la barra de navegación mostraría "Iniciar sesión".
 * 4. Un segundo después, algún código leería el token de sessionStorage, validaría la sesión y actualizaría el 
 * estado.
 * 5. La barra de navegación "parpadearía" y cambiaría para mostrar "Tu perfil" y "Cerrar sesión".
 *   Este estado es imprescindible para la lógica de renderizado condicional en la aplicación.
 *   Si isAuthCheckComplete es:
 *   - `false`: La comprobación del token de sesión está en curso. La UI debería mostrar un estado de carga
 *     (como un esqueleto o spinner) para evitar mostrar contenido incorrecto o una pantalla en blanco.
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
			// Inicia el temporizador para asegurar que la UI se muestre durante un tiempo mínimo.
			startTiming();

			// Intentamos obtener el token directamente de sessionStorage.
			// Esto es más seguro que depender del estado de Redux en el primer renderizado.
			let sessionToken = sessionStorage.getItem("token");

			// Si no encontramos la clave 'token', buscamos en el objeto 'authState' como respaldo.
			// Esto cubre casos donde el usuario tiene una sesión antigua guardada antes de nuestra actualización.
			if (!sessionToken) {
				const authState = sessionStorage.getItem("authState");
				if (authState) {
					try {
						sessionToken = JSON.parse(authState).token;
					} catch (e) {
						console.warn("Error al recuperar token de authState:", e);
					}
				}
			}
			// Si después de buscar en sessionStorage y en el respaldo authState no tenemos token,
			// no tiene sentido llamar al backend. Asumimos que no hay sesión válida.
			if (!sessionToken) {
				if (!controller.signal.aborted) {
					reduxDispatch(logout()); // Aseguramos que Redux esté limpio
					dispatchWithMinDisplayTime({ type: "AUTH_CHECK_COMPLETE" });
				}
				return;
			}

			try {
				// En una implementación real, pasaríamos controller.signal al servicio fetch.
				// Esto permitiría cancelar la petición si el componente se desmonta antes de que la respuesta llegue.
				const authData: AuthResponse | null = await verifyToken(sessionToken);

				if (!controller.signal.aborted) {
					// Si el token es válido, authData contendrá el usuario y el token.
					if (authData) {
						reduxDispatch(
							login({ user: authData.user, token: authData.token }),
						);
					}
				}
			} catch (error) {
				if ((error as Error).name === "AbortError") return;

				console.error(
					"Error en la verificación del estado de autenticación:",
					// Usamos error.message para un log más limpio, ya que el servicio ya formatea el error.
					(error as Error).message,
				);
				// Esto actualizará el estado de Redux para reflejar que el usuario no está autenticado.
				// También se elimina el token del sessionStorage para limpiar la sesión.
				// Si el componente ya no está montado, no hacemos nada.
				if (!controller.signal.aborted) {
					reduxDispatch(logout());
					sessionStorage.removeItem("token");
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
		verifyAuthStatus();

		// Función de limpieza que se ejecuta al desmontar el componente (por ejemplo si el usuario cierra la pestaña).
		// Pone isMounted a false para prevenir que se intente actualizar el estado de un componente que ya no existe.
		return () => {
			controller.abort();
		};
	}, [reduxDispatch, startTiming, dispatchWithMinDisplayTime, authDispatch]);

	return { isAuthCheckComplete: state.isAuthCheckComplete };
};
