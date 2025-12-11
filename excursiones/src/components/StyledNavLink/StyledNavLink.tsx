import React from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";
import styles from "./StyledNavLink.module.css";

/**
 * Componente de enlace de navegación con estilos consistentes.
 * Envuelve directamente a NavLink de react-router-dom para mantener toda su funcionalidad,
 * como el uso de funciones para `className` y `style` para estados activos.
 */
function StyledNavLink({
	className,
	...rest
}: Readonly<NavLinkProps>): JSX.Element {
	return (
		<NavLink
			className={(navLinkState) =>
				[
					"nav-link", // Clase base de Bootstrap para consistencia
					styles.styledNavLink,
					typeof className === "function" ? className(navLinkState) : className,
				]
					.filter(Boolean)
					.join(" ")
			}
			{...rest}
		/>
	);
}

export default StyledNavLink;
