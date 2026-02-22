import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface SkeletonThemeProps {
	baseColor: string;
	highlightColor: string;
}

// Define los colores del esqueleto en un objeto centralizado para facilitar el mantenimiento.
const SKELETON_COLORS: Record<"light" | "dark", SkeletonThemeProps> = {
	light: {
		// Colores coordinados con --color-stone-100 y --color-white-off
		baseColor: "hsl(40, 13%, 92%)", // #f2f0ee
		highlightColor: "hsl(40, 13%, 97%)", // #f9f8f7
	},
	dark: {
		// Colores coordinados con --color-green-dark-800 y --color-green-dark-700
		baseColor: "hsl(150, 10%, 20%)", // #2e3833
		highlightColor: "hsl(150, 10%, 25%)", // #3a473a
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
