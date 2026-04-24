import { useSelector } from "react-redux";
import { RootState } from "../store/store";

/**
 * Hook personalizado para obtener los colores base y de resaltado del esqueleto
 * en función del tema actual (claro/oscuro).
 *
 * @returns Un objeto con `baseColor` y `highlightColor` para `react-loading-skeleton`.
 */
export function useSkeletonTheme() {
	const mode = useSelector((state: RootState) => state.themeReducer.mode);

	// Define los colores del esqueleto según el tema para una experiencia visual consistente.
	// Estos colores están pensados para armonizar con la paleta de colores "Stone" y "Dark Nature".
	const baseColor = mode === "dark" ? "#202020" : "#e0e0e0"; // Gris oscuro para modo oscuro, gris claro para modo claro
	const highlightColor = mode === "dark" ? "#444" : "#f5f5f5"; // Gris más claro para modo oscuro, blanco roto para modo claro

	return {
		baseColor,
		highlightColor,
	};
}
