import React, { forwardRef } from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";
import styles from "./CustomLink.module.css";

/**
 * Componente de enlace de navegación con estilos consistentes.
 * Soporta ref forwarding para accesibilidad y composición.
 */
const CustomLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
	({ className, ...rest }, ref) => {
		return (
			<NavLink
				ref={ref}
				className={(navLinkState) =>
					[
						"nav-link", // Clase base de Bootstrap para consistencia
						styles.customLink,
						typeof className === "function" ? className(navLinkState) : className,
					]
						.filter(Boolean)
						.join(" ")
				}
				{...rest}
			/>
		);
	},
);

CustomLink.displayName = "CustomLink";

export default CustomLink;