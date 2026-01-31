import React from "react";
import styles from "./ExcursionDetailItem.module.css";

/**
 * Props para el componente ExcursionDetailItem.
 */
interface ExcursionDetailItemProps {
	/** El valor del detalle a mostrar (ej. "Media", "4 horas"). */
	readonly text?: string;
	/** Etiqueta descriptiva (ej. "Dificultad"). */
	readonly label?: string;
	/** Icono opcional para mostrar en lugar de la etiqueta de texto. */
	readonly icon?: React.ReactNode;
}

/**
 * Componente para mostrar un detalle específico de una excursión.
 */
function ExcursionDetailItem({
	text,
	label,
	icon,
}: ExcursionDetailItemProps): JSX.Element | null {
	if (!text) {
		// Si no hay texto, no renderizamos nada.
		return null;
	}

	return (
		<span
			className={styles.detailItem}
			title={label}
			aria-label={label ? `${label}: ${text}` : text}
		>
			{icon ? (
				<span className={styles.iconWrapper} aria-hidden="true">
					{icon}
				</span>
			) : (
				label && <span className={styles.detailLabel}>{label}: </span>
			)}
			{text}
		</span>
	);
}

export default ExcursionDetailItem;
