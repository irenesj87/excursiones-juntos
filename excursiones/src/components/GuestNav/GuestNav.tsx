import React from "react";
import cn from "classnames";
import StyledNavLink from "../StyledNavLink";
import { ROUTES } from "../../constants";
import styles from "./GuestNav.module.css";

interface GuestNavProps {
	/** Función para cerrar el menú contenedor (p. ej. un Offcanvas). */
	readonly onCloseMenu?: () => void;
	readonly variant?: "default" | "offcanvas";
	/**
	 * Clases CSS adicionales para aplicar al contenedor principal de los enlaces.
	 */
	readonly className?: string;
}

const NO_OP = () => {
	/* no-op */
};

/**
 * Muestra los enlaces de navegación para un usuario invitado (no logueado). Permite cerrar un menú contenedor (como un Offcanvas)
 * si se proporciona la función `onCloseMenu`.
 */
function GuestNav({
	className,
	onCloseMenu = NO_OP,
	variant = "default",
}: GuestNavProps): JSX.Element {
	return (
		<div
			className={cn(className, {
				// Para la variante por defecto, usamos flexbox para alinear los elementos horizontalmente,
				// replicando el comportamiento del esqueleto y asegurando una transición sin saltos (CLS).
				"d-flex align-items-center": variant === "default",
				[styles.offcanvasContainer]: variant === "offcanvas",
				"w-100": variant === "offcanvas",
			})}
		>
			<StyledNavLink
				to={ROUTES.REGISTER}
				onClick={onCloseMenu}
				className={cn(styles.registerLink, {
					"me-2": variant === "default",
					"border-0": variant === "offcanvas",
				})}
			>
				Regístrate
			</StyledNavLink>
			<StyledNavLink
				to={ROUTES.LOGIN}
				onClick={onCloseMenu}
				className={styles.loginLink}
			>
				Inicia sesión
			</StyledNavLink>
		</div>
	);
}

export default GuestNav;
