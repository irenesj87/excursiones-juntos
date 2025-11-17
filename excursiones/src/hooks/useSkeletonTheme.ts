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
	const mode = useSelector(
		(state: RootState) =>
			state.themeReducer.mode as keyof typeof SKELETON_COLORS
	);

	// El modo puede ser 'light' o 'dark', ambos definidos en SKELETON_COLORS.
	return SKELETON_COLORS[mode];
};
