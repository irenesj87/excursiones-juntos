import React from "react";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import cn from "classnames";
import { useDifficultyStyles } from "../../hooks/useDifficultyStyles";
import styles from "./ExcursionDetailItem.module.css";
import type { DifficultyLevel } from "../../types";

const DIFFICULTY = "Dificultad";

/**
 * Props para el componente ExcursionDetailItem.
 */
interface ExcursionDetailItemProps {
	/** El valor del detalle a mostrar (ej. "Media", "4 horas"). */
	readonly text?: string;
	/** Etiqueta descriptiva para accesibilidad y tooltips (ej. "Dificultad"). */
	readonly label?: string;
	/** El icono a mostrar junto al detalle. */
	readonly icon?: React.ReactNode;
}

/**
 * Array con los niveles de dificultad válidos.
 */
const validDifficultyLevels: DifficultyLevel[] = ["Baja", "Media", "Alta"];

/**
 * Type guard que comprueba si un string es un nivel de dificultad válido.
 */
const isDifficultyLevel = (value: string): value is DifficultyLevel => {
	return (validDifficultyLevels as string[]).includes(value);
};

/**
 * Componente para mostrar un detalle específico de una excursión.
 * Renderiza un componente diferente según si el detalle es la dificultad o no.
 */
const ExcursionDetailItem = (
	props: ExcursionDetailItemProps
): JSX.Element | null => {
	// Si no hay texto, no renderizamos nada.
	const { text, label, icon } = props;

	// Determina si el item es de tipo "Dificultad" para aplicar estilos especiales.
	// La comprobación de `text` es necesaria para el type guard.
	const isDifficulty =
		label === DIFFICULTY && !!text && isDifficultyLevel(text);

	// Hook para obtener la clase de estilo solo si es un item de dificultad.
	// Se llama siempre en el nivel superior del componente.
	const { difficultyClass } = useDifficultyStyles(
		isDifficulty ? text : null,
		styles
	);

	// El "early return" se mueve aquí, después de que todos los hooks se hayan llamado.
	if (!text) {
		return null;
	}

	// Función única para renderizar el tooltip, evitando duplicación.
	const renderTooltip = (tooltipProps: TooltipProps): React.ReactElement => (
		<Tooltip {...tooltipProps}>{label ? `${label}: ${text}` : text}</Tooltip>
	);

	return (
		<OverlayTrigger placement="top" overlay={renderTooltip}>
			<button type="button" className={styles.detailItem}>
				{label && <span className="visually-hidden">{`${label}: `}</span>}
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
