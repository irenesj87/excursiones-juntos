import type { DifficultyLevel } from "../types";

/**
 * Define la estructura esperada para los módulos de estilo CSS que se pasan al hook.
 * Esto permite que el hook sea flexible y funcione con diferentes archivos CSS.
 */
interface StyleModules {
	[key: string]: string;
}

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
 * Un hook personalizado que genera los nombres de clase CSS para un nivel de dificultad.
 * Centraliza la lógica de construcción de clases, pero permanece desacoplado al recibir
 * los módulos de estilo como argumento.
 *
 * @param difficultyLevel - El nivel de dificultad ("Baja", "Media", "Alta").
 * @param styles - Un objeto que contiene los módulos de estilo necesarios.
 * @returns Un objeto con los nombres de clase computados (`difficultyClass` y `checkedDifficultyClass`).
 */
export const useDifficultyStyles = (
	difficultyLevel: DifficultyLevel,
	styles: StyleModules
) => {
	const variant = getDifficultyVariant(difficultyLevel);
	const capitalizedVariant = variant.charAt(0).toUpperCase() + variant.slice(1);

	// Genera los nombres de clase usando las convenciones de cada componente.
	// El componente que no necesite una clase, simplemente la ignorará.
	return {
		difficultyClass: styles[`difficulty${capitalizedVariant}`], // Para ExcursionDetailItem (ej: difficultyLow)
		checkedDifficultyClass: styles[`${variant}Checked`], // Para FiltersListCheckbox (ej: lowChecked)
		baseDifficultyClass: styles[variant], // Para FiltersListCheckbox (ej: low)
	};
};
