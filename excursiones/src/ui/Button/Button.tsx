import { forwardRef } from "react";
import { Button as BootstrapButton, Spinner } from "react-bootstrap";
import cn from "classnames";
import styles from "./Button.module.css";

/**
 * Props para el componente Button.
 */
interface ButtonProps {
	/** El texto que se mostrará dentro del botón. */
	readonly children: string;
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
	/** ID del elemento que controla este botón. */
	readonly "aria-controls"?: string;
	/** Etiqueta accesible para el botón. */
	readonly "aria-label"?: string;
}

/**
 * Un componente de botón personalizado y reutilizable que extiende la funcionalidad
 * del botón de React Bootstrap.
 *
 * @param {ButtonProps} props - Propiedades del componente.
 * @param {React.Ref<HTMLButtonElement>} ref - Referencia al elemento botón subyacente.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			children,
			onClick,
			type = "button",
			variant = "primary",
			className = "",
			disabled = false,
			isLoading = false,
			"aria-controls": ariaControls,
			"aria-label": ariaLabel,
		},
		ref,
	) => {
		const buttonClass = cn(styles.button, styles[variant], className);

		return (
			<BootstrapButton
				ref={ref}
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
						<Spinner
							as="span"
							animation="border"
							size="sm"
							aria-hidden="true"
						/>
						<span className="visually-hidden">Cargando...</span>
					</span>
				)}
				<span className={isLoading ? styles.hiddenContent : undefined}>
					{children}
				</span>
			</BootstrapButton>
		);
	},
);

Button.displayName = "Button";
