import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";

const SESSION_STORAGE_KEY = "authState";

/**
 * Guarda el estado de autenticación en sessionStorage.
 * @param state - El estado a guardar.
 */
const saveStateToSessionStorage = (state: LoginState) => {
	try {
		const serializedState = JSON.stringify(state);
		sessionStorage.setItem(SESSION_STORAGE_KEY, serializedState);
		// Sincronizamos también el token individualmente para que useAuth lo encuentre
		if (state.token) {
			sessionStorage.setItem("token", state.token);
		}
	} catch (e) {
		console.warn("No se pudo guardar el estado en sessionStorage", e);
	}
};

/**
 * Carga el estado de autenticación desde sessionStorage.
 * @returns El estado guardado o undefined si no existe.
 */
const loadStateFromSessionStorage = (): LoginState | undefined => {
	try {
		const serializedState = sessionStorage.getItem(SESSION_STORAGE_KEY);
		if (serializedState === null) {
			return undefined;
		}
		const state: LoginState = JSON.parse(serializedState);
		// Si tenemos un estado guardado, nos aseguramos de que el login sea true
		// para mantener la consistencia al recargar.
		if (state.token && state.user) {
			state.login = true;
		}
		return state;
	} catch (e) {
		console.warn("No se pudo cargar el estado desde sessionStorage", e);
		return undefined;
	}
};

interface LoginState {
	login: boolean;
	user: User | null;
	token: string | null;
}

// Estado inicial por defecto si no hay nada en sessionStorage.
const defaultInitialState: LoginState = {
	login: false,
	user: null,
	token: null,
};

// Intentamos cargar el estado desde sessionStorage. Si no existe, usamos el estado por defecto.
const initialState: LoginState =
	loadStateFromSessionStorage() ?? defaultInitialState;

export const loginSlice = createSlice({
	name: "login",
	initialState,
	reducers: {
		login: (state, action: PayloadAction<{ user: User; token: string }>) => {
			state.login = true;
			state.user = action.payload.user;
			state.token = action.payload.token;
			saveStateToSessionStorage(state); // Guardamos el estado en sessionStorage
		},
		logout: (state) => {
			// Reseteamos el estado a los valores iniciales por defecto.
			Object.assign(state, defaultInitialState);
			sessionStorage.removeItem(SESSION_STORAGE_KEY); // Limpiamos sessionStorage
			sessionStorage.removeItem("token");
		},
		updateUser: (state, action: PayloadAction<{ user: User }>) => {
			// Actualizamos solo las excursiones para no perder otros datos del usuario
			// y aseguramos que el estado de login y el token se mantengan.
			if (state.user) {
				// Creamos un nuevo objeto de usuario para asegurar que Redux detecte el cambio.
				// Se combinan los datos del usuario existente con la nueva lista de excursiones.
				state.user = {
					...state.user,
					excursions: action.payload.user.excursions,
				};
				// Guardamos el estado completo y actualizado en sessionStorage.
				saveStateToSessionStorage(state);
			}
		},
		updateUserInfo: (state, action: PayloadAction<{ user: User }>) => {
			// Actualizamos la información del usuario (nombre, teléfono, etc.)
			// El token se mantiene intacto en el estado y se vuelve a guardar.
			if (state.user) {
				state.user = action.payload.user;
				saveStateToSessionStorage(state);
			}
		},
	},
});

export const { login, logout, updateUser, updateUserInfo } = loginSlice.actions;
export default loginSlice.reducer;
