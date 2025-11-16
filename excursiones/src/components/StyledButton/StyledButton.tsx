import React from "react";
import { Button, Spinner } from "react-bootstrap";
import styles from "./StyledButton.module.css";

/**
 * Props para el componente StyledButton.
 */
interface StyledButtonProps {
	/** El contenido textual del botón. Por seguridad, solo se aceptan strings o números. */
	children: string | number;
	/** Función a ejecutar al hacer clic. */
	onClick?: () => void;
	/** El tipo de botón. */
	type?: "button" | "submit" | "reset";
	/** La variante de estilo del botón. */
	variant?: "primary" | "secondary";
	/** Clases CSS adicionales para personalizar. */
	className?: string;
	/** Si el botón está deshabilitado. */
	disabled?: boolean;
	/** Si el botón está en estado de carga. */
	isLoading?: boolean;
}

/**
 * Un componente de botón personalizado y reutilizable que extiende la funcionalidad
 * del botón de React Bootstrap.
 */
const StyledButton = ({
	children,
	onClick,
	type = "button",
	variant = "primary",
	className = "",
	disabled = false,
	isLoading = false,
}: StyledButtonProps) => {
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
};

export default StyledButton;
