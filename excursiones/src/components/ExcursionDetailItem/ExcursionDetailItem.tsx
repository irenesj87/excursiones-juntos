import React from "react";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import cn from "classnames";
import styles from "./ExcursionDetailItem.module.css";
import type { DifficultyLevel } from "../../types";

/**
 * Props para el componente ExcursionDetailItem.
 */
interface ExcursionDetailItemProps {
	/** El valor del detalle a mostrar (ej. "Media", "4 horas"). */
	readonly text?: string;
	/** Etiqueta descriptiva para accesibilidad y tooltips (ej. "Dificultad"). */
	readonly label?: string;
}

/**
 * Define los nombres de las variantes de estilo para la dificultad.
 * Se utiliza internamente para mapear a clases CSS.
 */
type DifficultyVariant =
	| "difficulty-low"
	| "difficulty-medium"
	| "difficulty-high";

// Mapa para asociar las variantes de dificultad con sus clases CSS correspondientes.
const variantClassMap: Record<DifficultyVariant, string> = {
	"difficulty-low": styles.difficultyLow,
	"difficulty-medium": styles.difficultyMedium,
	"difficulty-high": styles.difficultyHigh,
};

/**
 * Convierte un nivel de dificultad (ej. "Baja") en su variante de estilo correspondiente (ej. "difficulty-low").
 * @param difficultyLevel El nivel de dificultad textual ("Baja", "Media", "Alta").
 * @returns La variante de estilo como string.
 */
const getDifficultyVariant = (
	difficultyLevel: DifficultyLevel
): DifficultyVariant => {
	const lowerCaseDifficulty =
		difficultyLevel.toLowerCase() as Lowercase<DifficultyLevel>;
	const variantMap: Record<Lowercase<DifficultyLevel>, DifficultyVariant> = {
		baja: "difficulty-low",
		media: "difficulty-medium",
		alta: "difficulty-high",
	};
	return variantMap[lowerCaseDifficulty];
};

/**
 * Componente para mostrar un detalle específico de una excursión como su nivel de dificultad o duración.
 */
const ExcursionDetailItem = ({
	text,
	label,
}: ExcursionDetailItemProps): JSX.Element | null => {
	// Determina la variante de estilo a aplicar. Si la etiqueta es "Dificultad", calcula la variante basada en el texto.
	const variant =
		label === "Dificultad" && text
			? getDifficultyVariant(text as DifficultyLevel)
			: undefined;

	// Renderiza el Tooltip para el detalle de la excursión.
	const renderTooltip = (props: TooltipProps): React.ReactElement => (
		<Tooltip {...props}>{label ? `${label}: ${text}` : text}</Tooltip>
	);

	/*
	 * Si no hay texto para mostrar, no renderizamos nada.
	 * Esta comprobación se hace después de los hooks para cumplir las reglas de los hooks.
	 */
	if (!text) {
		return null;
	}

	// Contenido del ítem, incluyendo etiqueta oculta y texto.
	const itemContent = (
		<>
			{label && <span className="visually-hidden">{`${label}: `}</span>}
			<span
				className={cn(
					styles.difficultyBadge,
					variant && variantClassMap[variant]
				)}
			>
				{text}
			</span>
		</>
	);

	// El componente siempre es interactivo y muestra un tooltip.
	return (
		<OverlayTrigger placement="top" overlay={renderTooltip}>
			{/* Usamos un botón para la semántica y accesibilidad nativa. */}
			<button type="button" className={styles.detailItem}>
				{itemContent}
			</button>
		</OverlayTrigger>
	);
};

export default ExcursionDetailItem;
