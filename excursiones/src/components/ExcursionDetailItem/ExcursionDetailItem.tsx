import React from "react";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import styles from "./ExcursionDetailItem.module.css";

/**
 * Props para el componente ExcursionDetailItem.
 */
interface ExcursionDetailItemProps {
	/** El componente de icono a renderizar. */
	readonly IconComponent?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	/** El valor del detalle a mostrar (ej. "Media", "4 horas"). */
	readonly text?: string;
	/** Etiqueta descriptiva para accesibilidad y tooltips (ej. "Dificultad"). */
	readonly label?: string;
	/** Nodos hijos para renderizar contenido personalizado en lugar del texto. */
	readonly children?: React.ReactNode;
}

/**
 * Componente para mostrar un detalle específico de una excursión (ej. dificultad, tiempo).
 * ¡ADVERTENCIA DE SEGURIDAD! Si el contenido de `children` proviene de una fuente externa (API, usuario),
 * debe ser sanitizado para prevenir ataques XSS.
 * @param {ExcursionDetailItemProps} props - Las propiedades del componente.
 * @returns {React.ReactElement | null} - El elemento React que representa el detalle de la excursión, o null si no hay contenido.
 */
function ExcursionDetailItem({
	IconComponent,
	text,
	label,
	children,
}: ExcursionDetailItemProps): React.ReactElement | null {
	/**
	 * Renderiza el Tooltip para el detalle de la excursión.
	 * @param {TooltipProps} props - Propiedades inyectadas por OverlayTrigger.
	 * @returns {React.ReactElement} - El elemento Tooltip.
	 */
	const renderTooltip = (props: TooltipProps): React.ReactElement => (
		<Tooltip {...props}>{label ? `${label}: ${text}` : text}</Tooltip>
	);

	// Si no hay texto ni hijos para mostrar, no renderizamos nada.
	// Esta comprobación se hace DESPUÉS de los hooks para cumplir las reglas de los hooks.
	if (!text && !children) {
		return null;
	}

	// Contenido del ítem, incluyendo icono, etiqueta oculta y texto o hijos personalizados.
	const itemContent = (
		<>
			{IconComponent && (
				<IconComponent
					className={styles.detailIcon}
					aria-hidden="true"
					data-testid="detail-item-icon"
				/>
			)}
			{label && <span className="visually-hidden">{`${label}: `}</span>}
			{children || <span>{text}</span>}
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
}

export default ExcursionDetailItem;
