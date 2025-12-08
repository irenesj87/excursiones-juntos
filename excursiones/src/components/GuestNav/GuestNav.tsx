import React from "react";
import cn from "classnames";
import StyledNavLink from "../StyledNavLink";
import { ROUTES } from "../../constants";
import styles from "./GuestNav.module.css";

interface GuestNavProps {
	/** Define la apariencia y el layout de los enlaces de navegación. */
	readonly onCloseMenu?: () => void;
	readonly variant?: "default" | "offcanvas";
	/**
	 * Clases CSS adicionales para aplicar al contenedor principal de los enlaces.
	 */
	readonly className?: string;
}

/**
 * Muestra los enlaces de navegación para un usuario invitado (no logueado). Permite cerrar un menú contenedor (como un Offcanvas)
 * si se proporciona la función `onCloseMenu`.
 */
const GuestNav = ({
	className,
	onCloseMenu = () => {
		/* no-op */
	},
	variant = "default",
}: GuestNavProps): JSX.Element => (
	<div
		className={cn(className, {
			// Aplica clases específicas cuando la variante es 'offcanvas' para controlar la disposición y el ancho.
			[styles.offcanvasContainer]: variant === "offcanvas",
			"w-100": variant === "offcanvas",
		})}
	>
		<StyledNavLink
			to={ROUTES.REGISTER}
			onClick={onCloseMenu}
			variant="link"
			className={cn(styles.registerLink, { "me-lg-2": variant === "default" })}
		>
			Regístrate
		</StyledNavLink>
		<StyledNavLink
			to={ROUTES.LOGIN}
			onClick={onCloseMenu}
			variant="button"
			className={styles.loginLink}
		>
			Inicia sesión
		</StyledNavLink>
	</div>
);

export default GuestNav;
