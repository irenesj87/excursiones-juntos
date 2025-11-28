import React from "react";
import StyledNavLink from "../StyledNavLink";
import { ROUTES } from "../../constants";
import styles from "./GuestNav.module.css"

interface GuestNavProps {
	readonly onCloseMenu?: () => void; // Función para cerrar el menú contenedor en breakpoints pequeños.
}

/**
 * Muestra los enlaces de navegación para un usuario invitado (no logueado). Permite cerrar un menú contenedor (como un Offcanvas)
 * si se proporciona la función `onCloseMenu`.
 */
const GuestNav = ({
	onCloseMenu = () => {
		/* no-op */
	},
}: GuestNavProps): JSX.Element => (
	<>
		<StyledNavLink
			to={ROUTES.REGISTER}
			onClick={onCloseMenu}
			variant="link"
			className="me-lg-2"
		>
			Regístrate
		</StyledNavLink>
		<StyledNavLink to={ROUTES.LOGIN} onClick={onCloseMenu} variant="button" className={styles.loginLink}>
			Inicia sesión
		</StyledNavLink>
	</>
);

export default GuestNav;
