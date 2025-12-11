import React from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";
import styles from "./StyledNavLink.module.css";

/**
 * Componente de enlace de navegación con estilos consistentes.
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
