import React from "react";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import cn from "classnames";
import { DIFFICULTY, VALID_DIFFICULTY_LEVELS } from "../../constants";
import { useDifficultyStyles } from "../../hooks/useDifficultyStyles";
import styles from "./ExcursionDetailItem.module.css";

/**
 * Props para el componente ExcursionDetailItem.
 */
interface ExcursionDetailItemProps {
	/** El valor del detalle a mostrar (ej. "Media", "4 horas"). */
	readonly text?: string;
	/** Etiqueta descriptiva para tooltips (ej. "Dificultad"). */
	readonly label?: string;
	/** El icono a mostrar junto al detalle. */
	readonly icon?: React.ReactNode;
	/** Variante de visualización. Permite forzar el estilo de dificultad explícitamente. */
	readonly variant?: "default" | "difficulty";
}

/**
 * Guarda de tipo que comprueba si un string es un nivel de dificultad válido.
 */
const isDifficultyLevel = (
	value: string
	// Si esta función retorna true, value ya no es un string cualquiera, sino que es uno de los valores específicos del array
): value is (typeof VALID_DIFFICULTY_LEVELS)[number] =>
	// Se necesita poner readonly string[] para evitar problemas de tipo
	(VALID_DIFFICULTY_LEVELS as readonly string[]).includes(value);

/**
 * Componente para mostrar un detalle específico de una excursión.
 * Renderiza un componente diferente según si el detalle es la dificultad o no.
 */
function ExcursionDetailItem({
	text,
	label,
	icon,
	variant = "default",
}: ExcursionDetailItemProps): JSX.Element | null {
	/*
	 * Determina si el item es de tipo "Dificultad" para aplicar estilos especiales.
	 * Prioriza la prop 'variant' si es 'difficulty'.
	 * De lo contrario, usa la lógica de inferencia basada en la etiqueta (legacy).
	 */
	const isDifficulty =
		variant === "difficulty" ||
		(variant === "default" &&
			label === DIFFICULTY &&
			!!text &&
			isDifficultyLevel(text));

	// Hook para obtener la clase de estilo solo si es un item de dificultad.
	const { difficultyClass } = useDifficultyStyles(
		isDifficulty && text && isDifficultyLevel(text) ? text : null,
		styles
	);

	if (!text) {
		// Si no hay texto, no renderizamos nada.
		return null;
	}

	// Función para renderizar el tooltip.
	const renderTooltip = (tooltipProps: TooltipProps): React.ReactElement => (
		<Tooltip {...tooltipProps}>{label ? `${label}: ${text}` : text}</Tooltip>
	);

	return (
		<OverlayTrigger placement="top" overlay={renderTooltip}>
			<button type="button" className={styles.detailItem}>
				{isDifficulty ? (
					<span
						className={cn(
							styles.difficultyBadge,
							difficultyClass,
							styles.difficultyBadgeWithIcon
						)}
					>
						{icon}
						{text}
					</span>
				) : (
					<>
						{icon}
						<span>{text}</span>
					</>
				)}
			</button>
		</OverlayTrigger>
	);
}

export default ExcursionDetailItem;
