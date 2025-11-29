import styles from "../components/ExcursionDetailItem/ExcursionDetailItem.module.css";
import checkboxStyles from "../components/FiltersListCheckbox/FiltersListCheckbox.module.css";
import type { DifficultyLevel } from "../types";

/**
 * Define los nombres de las variantes de estilo para la dificultad.
 * Se utiliza internamente para mapear a clases CSS.
 */
type DifficultyVariant = "low" | "medium" | "high";

/**
 * Convierte un nivel de dificultad (ej. "Baja") en su variante de estilo correspondiente (ej. "low").
 * @param difficultyLevel El nivel de dificultad textual ("Baja", "Media", "Alta").
 * @returns La variante de estilo como string.
 */
const getDifficultyVariant = (
	difficultyLevel: DifficultyLevel
): DifficultyVariant => {
	const lowerCaseDifficulty =
		difficultyLevel.toLowerCase() as Lowercase<DifficultyLevel>;
	const variantMap: Record<Lowercase<DifficultyLevel>, DifficultyVariant> = {
		baja: "low",
		media: "medium",
		alta: "high",
	};
	return variantMap[lowerCaseDifficulty];
};

/**
 * Un hook personalizado que devuelve las clases CSS para un nivel de dificultad determinado.
 * @param difficultyLevel - El nivel de dificultad ("Baja", "Media", "Alta").
 * @returns Un objeto con `difficultyClass` para el estado normal y `checkedDifficultyClass` para el estado seleccionado.
 */
export const useDifficultyStyles = (difficultyLevel: DifficultyLevel) => {
	const variant = getDifficultyVariant(difficultyLevel);

	const difficultyClass =
		styles[`difficulty${variant.charAt(0).toUpperCase() + variant.slice(1)}`];
	const checkedDifficultyClass =
		checkboxStyles[
			`checked${variant.charAt(0).toUpperCase() + variant.slice(1)}`
		];

	return { difficultyClass, checkedDifficultyClass };
};
