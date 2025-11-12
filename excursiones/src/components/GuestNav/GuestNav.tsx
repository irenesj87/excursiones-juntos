import React from "react";
import StyledNavLink from "../StyledNavLink";
import { ROUTES } from "../../constants";

interface GuestNavProps {
	readonly onCloseMenu?: () => void; // Función para cerrar el menú contenedor en breakpoints pequeños.
}

/**
 * Muestra los enlaces de navegación para un usuario invitado (no logueado). Permite cerrar un menú contenedor (como un Offcanvas)
 * si se proporciona la función `onCloseMenu`.
 */
const GuestNav = ({ onCloseMenu = () => {} }: GuestNavProps) => (
	<>
		<StyledNavLink
			to={ROUTES.REGISTER}
			onClick={onCloseMenu}
			variant="link"
			className="me-lg-2"
		>
			Regístrate
		</StyledNavLink>
		<StyledNavLink to={ROUTES.LOGIN} onClick={onCloseMenu} variant="button">
			Inicia sesión
		</StyledNavLink>
	</>
);

export default GuestNav;
