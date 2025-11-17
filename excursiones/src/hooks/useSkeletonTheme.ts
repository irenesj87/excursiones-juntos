import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface SkeletonThemeProps {
	baseColor: string;
	highlightColor: string;
}

// Define los colores del esqueleto en un objeto centralizado para facilitar el mantenimiento.
const SKELETON_COLORS: Record<"light" | "dark", SkeletonThemeProps> = {
	light: {
		baseColor: "#e0e0e0",
		highlightColor: "#f5f5f5",
	},
	dark: {
		baseColor: "#202020",
		highlightColor: "#444",
	},
};

/**
 * Hook personalizado para obtener las props de tema para `react-loading-skeleton`.
 * Encapsula la lógica para seleccionar los colores del esqueleto según el modo de tema actual.
 */
export const useSkeletonTheme = (): SkeletonThemeProps => {
	const mode = useSelector((state: RootState) => state.themeReducer.mode);

	// Se valida que el `mode` del estado sea una de las claves esperadas.
	// Si no lo es (p. ej., si localStorage tiene un valor inválido),
	// se devuelve el tema 'light' por defecto para evitar errores en tiempo de ejecución.
	if (mode === "light" || mode === "dark") {
		return SKELETON_COLORS[mode];
	}

	return SKELETON_COLORS.light;
};
