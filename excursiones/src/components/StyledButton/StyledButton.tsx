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
}: StyledButtonProps) {
	// Combina las clases: la base, la variante y cualquier clase extra pasada por props.
	const buttonClass = `${styles.styledButton} ${styles[variant]} ${className}`;

	return (
		<Button
			type={type}
			className={buttonClass}
			onClick={onClick}
			disabled={disabled || isLoading}
			aria-busy={isLoading}
		>
			{isLoading ? (
				<>
					<Spinner
						as="span"
						animation="border"
						size="sm"
						aria-hidden="true"
						className="me-2"
					/>
					<span className="visually-hidden">Cargando...</span>
				</>
			) : (
				children // El texto original solo se muestra si no está cargando
			)}
		</Button>
	);
}

export default StyledButton;
