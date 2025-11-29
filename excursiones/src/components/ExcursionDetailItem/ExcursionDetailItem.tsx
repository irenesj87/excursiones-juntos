import React from "react";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import cn from "classnames";
import { useDifficultyStyles } from "../../hooks/useDifficultyStyles";
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
	/** El icono a mostrar junto al detalle. */
	readonly icon?: React.ReactNode;
}

// Componente interno que renderiza el contenido y aplica los estilos de dificultad.
const DifficultyItem = ({ text, label, icon }: ExcursionDetailItemProps) => {
	// El hook solo se llama aquí, donde sabemos que `text` es una DifficultyLevel.
	const { difficultyClass } = useDifficultyStyles(text as DifficultyLevel);
	const renderTooltip = (props: TooltipProps): React.ReactElement => (
		<Tooltip {...props}>{label ? `${label}: ${text}` : text}</Tooltip>
	);
	return (
		<OverlayTrigger placement="top" overlay={renderTooltip}>
			<button type="button" className={styles.detailItem}>
				{icon}
				{label && <span className="visually-hidden">{`${label}: `}</span>}
				<span className={cn(styles.difficultyBadge, difficultyClass)}>
					{text}
				</span>
			</button>
		</OverlayTrigger>
	);
};

// Componente interno para detalles genéricos (sin estilos de dificultad).
const GenericItem = ({ text, label, icon }: ExcursionDetailItemProps) => {
	const renderTooltip = (props: TooltipProps): React.ReactElement => (
		<Tooltip {...props}>{label ? `${label}: ${text}` : text}</Tooltip>
	);
	return (
		<OverlayTrigger placement="top" overlay={renderTooltip}>
			<button type="button" className={styles.detailItem}>
				{icon}
				{label && <span className="visually-hidden">{`${label}: `}</span>}
				<span>{text}</span>
			</button>
		</OverlayTrigger>
	);
};

/**
 * Componente para mostrar un detalle específico de una excursión.
 * Renderiza un componente diferente según si el detalle es la dificultad o no.
 */
const ExcursionDetailItem = (
	props: ExcursionDetailItemProps
): JSX.Element | null => {
	// Si no hay texto, no renderizamos nada.
	if (!props.text) {
		return null;
	}

	// Decidimos qué componente renderizar. Esto no viola las reglas de los Hooks.
	return props.label === "Dificultad" ? (
		<DifficultyItem {...props} />
	) : (
		<GenericItem {...props} />
	);
};

export default ExcursionDetailItem;
