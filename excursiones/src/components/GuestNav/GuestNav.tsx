import React from "react";
import cn from "classnames";
import StyledNavLink from "../StyledNavLink";
import { ROUTES } from "../../constants";
import styles from "./GuestNav.module.css";

interface GuestNavProps {
	readonly onCloseMenu?: () => void; // Función para cerrar el menú contenedor en breakpoints pequeños.
	readonly variant?: "default" | "offcanvas";
}

/**
 * Muestra los enlaces de navegación para un usuario invitado (no logueado). Permite cerrar un menú contenedor (como un Offcanvas)
 * si se proporciona la función `onCloseMenu`.
 */
const GuestNav = ({
	onCloseMenu = () => {
		/* no-op */
	},
	variant = "default",
}: GuestNavProps): JSX.Element => (
	<div
		className={cn({
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
