import React from "react";
import { Button, Spinner } from "react-bootstrap";
import styles from "./StyledButton.module.css";

/**
 * Props para el componente StyledButton.
 */
interface StyledButtonProps {
	/** El contenido del botón. Puede ser texto, iconos o cualquier nodo renderizable. */
	readonly children: React.ReactNode;
	/** Función a ejecutar al hacer clic. */
	readonly onClick?: () => void;
	/** El tipo de botón. */
	readonly type?: "button" | "submit" | "reset";
	/** La variante de estilo del botón. */
	readonly variant?: "primary" | "secondary" | "success" | "danger";
	/** Clases CSS adicionales para personalizar. */
	readonly className?: string;
	/** Si el botón está deshabilitado. */
	readonly disabled?: boolean;
	/** Si el botón está en estado de carga. */
	readonly isLoading?: boolean;
	/** ID del elemento que controla este botón (A11y). */
	readonly "aria-controls"?: string;
	/** Etiqueta accesible para el botón (A11y). */
	readonly "aria-label"?: string;
}

/**
 * Un componente de botón personalizado y reutilizable que extiende la funcionalidad
 * del botón de React Bootstrap.
 */
function StyledButton({
	children,
	onClick,
	type = "button",
	variant = "primary",
	className = "",
	disabled = false,
	isLoading = false,
	"aria-controls": ariaControls,
	"aria-label": ariaLabel,
}: StyledButtonProps) {
	// Combina las clases: la base, la variante y cualquier clase extra pasada por props.
	const buttonClass = `${styles.styledButton} ${styles[variant]} ${className}`;

	return (
		<Button
			variant={variant}
			type={type}
			className={buttonClass}
			onClick={onClick}
			disabled={disabled || isLoading}
			aria-busy={isLoading}
			aria-controls={ariaControls}
			aria-label={ariaLabel}
		>
			{isLoading && (
				<span className={styles.spinnerOverlay}>
					<Spinner as="span" animation="border" size="sm" aria-hidden="true" />
					<span className="visually-hidden">Cargando...</span>
				</span>
			)}
			<span className={isLoading ? styles.hiddenContent : undefined}>
				{children}
			</span>
		</Button>
	);
}

export default StyledButton;
