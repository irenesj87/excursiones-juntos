import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define el tipo para el modo del tema, que solo puede ser 'light' o 'dark'.
type ThemeMode = "light" | "dark";

// Define la estructura del estado del tema.
interface ThemeState {
	mode: ThemeMode;
}

const getInitialMode = (): ThemeMode => {
	// On the server, there's no localStorage or matchMedia, so return a default.
	if (globalThis.window === undefined) {
		return "light";
	}

	const storedMode = localStorage.getItem("themeMode");
	// Valida que el modo guardado en localStorage sea uno de los permitidos.
	if (storedMode === "light" || storedMode === "dark") {
		return storedMode;
	}
	// Si no hay nada válido, usa la preferencia del sistema operativo.
	const prefersDark =
		globalThis.window.matchMedia &&
		globalThis.window.matchMedia("(prefers-color-scheme: dark)").matches;
	return prefersDark ? "dark" : "light";
};

const initialState: ThemeState = {
	mode: getInitialMode(),
};

export const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		toggleMode: (state) => {
			state.mode = state.mode === "light" ? "dark" : "light";
		},
		setMode: (state, action: PayloadAction<ThemeMode>) => {
			state.mode = action.payload;
		},
	},
});

export const { toggleMode, setMode } = themeSlice.actions;
export default themeSlice.reducer;
