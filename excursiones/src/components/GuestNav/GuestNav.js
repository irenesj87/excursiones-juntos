import React from "react";
import StyledNavLink from "../StyledNavLink";
import { ROUTES } from "../../constants";

/**
 * @typedef {object} GuestNavProps
 * @property {() => void} [onCloseMenu] - Función para cerrar el menú contenedor en breakpoints pequeños.
 */

/**
 * Muestra los enlaces de navegación para un usuario invitado (no logueado). Permite cerrar un menú contenedor (como un Offcanvas)
 * si se proporciona la función `onCloseMenu`.
 * @param {GuestNavProps} props - Las propiedades del componente.
 * @returns {React.ReactElement} - El componente de navegación para invitados.
 */
const GuestNav = ({ onCloseMenu = () => {} }) => (
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
