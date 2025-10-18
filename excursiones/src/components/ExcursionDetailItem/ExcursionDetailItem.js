import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "./ExcursionDetailItem.module.css";

/**
 * Componente para mostrar un detalle específico de una excursión (ej. dificultad, tiempo).
 * @param {object} props - Las propiedades del componente.
 * @param {React.ComponentType<React.SVGProps<SVGSVGElement>>} [props.IconComponent] - El componente de icono a renderizar.
 * @param {string} [props.text] - El valor del detalle a mostrar (ej. "Media", "4 horas").
 * @param {string} [props.label] - Etiqueta descriptiva para accesibilidad y tooltips (ej. "Dificultad").
 * @param {React.ReactNode} [props.children] - Nodos hijos para renderizar contenido personalizado en lugar del texto.
 * ¡ADVERTENCIA DE SEGURIDAD! Si el contenido de `children` proviene de una fuente externa (API, usuario),
 * debe ser sanitizado para prevenir ataques XSS.
 * @returns {React.ReactElement} - El elemento React que representa el detalle de la excursión.
 */
function ExcursionDetailItem({ IconComponent, text, label, children }) {
	/**
	 * Renderiza el Tooltip para el detalle de la excursión.
	 * @param {object} props - Propiedades inyectadas por OverlayTrigger.
	 * @returns {React.ReactElement} - El elemento Tooltip.
	 */
	const renderTooltip = (props) => (
		<Tooltip {...props}>{label ? `${label}: ${text}` : text}</Tooltip>
	);

	// Si no hay texto ni hijos para mostrar, no renderizamos nada.
	// Esta comprobación se hace DESPUÉS de los hooks para cumplir las reglas de los hooks.
	if (!text && !children) {
		return null; // No renderizar nada si no hay contenido.
	}

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
