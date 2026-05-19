import React from "react";
import styles from "./DetailItem.module.css";

/**
 * Props para el componente DetailItem.
 */
interface DetailItemProps {
	/** El valor del detalle a mostrar (ej. "Media", "4 horas"). */
	readonly text?: string;
	/** Etiqueta descriptiva (ej. "Dificultad"). */
	readonly label?: string;
	/** Icono opcional para mostrar en lugar de la etiqueta de texto. */
	readonly icon?: React.ReactNode;
}

/**
 * Componente para mostrar un detalle específico de una excursión o información.
 */
export function DetailItem({
	text,
	label,
	icon,
}: DetailItemProps): JSX.Element | null {
	if (!text) {
		// Si no hay texto, no renderizamos nada.
		return null;
	}

	return (
		<span className={styles.detailItem}>
			{icon && (
				<span className={styles.iconWrapper} aria-hidden="true">
					{icon}
				</span>
			)}
			{label && (
				<span className={icon ? "visually-hidden" : styles.detailLabel}>
					{label}:{" "}
				</span>
			)}
			{text}
		</span>
	);
}
