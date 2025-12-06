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
const ExcursionDetailItem = (
	props: ExcursionDetailItemProps
): JSX.Element | null => {
	const { text, label, icon } = props;

	/*
	 * Determina si el item es de tipo "Dificultad" para aplicar estilos especiales.
	 * Para ello tiene que cumplir tres condiciones:
	 * 1. La label tiene que decir "Dificultad".
	 * 2. El texto debe existir.
	 * 3. El texto debe de ser un nivel de dificultad válido, es decir, "Baja", "Media" o "Alta".
	 */
	const isDifficulty =
		label === DIFFICULTY && !!text && isDifficultyLevel(text);

	// Hook para obtener la clase de estilo solo si es un item de dificultad.
	const { difficultyClass } = useDifficultyStyles(
		isDifficulty ? text : null,
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
};

export default ExcursionDetailItem;
