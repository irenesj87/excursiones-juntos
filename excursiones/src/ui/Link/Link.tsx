import { forwardRef } from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";
import styles from "./Link.module.css";

/**
 * Componente de enlace de navegación con estilos consistentes.
 * Soporta ref forwarding para accesibilidad y composición.
 */
export const Link = forwardRef<HTMLAnchorElement, NavLinkProps>(function Link(
	{ className, ...rest },
	ref,
) {
	return (
		<NavLink
			ref={ref}
			className={(navLinkState) =>
				[
					"nav-link", // Clase base de Bootstrap para consistencia
					styles.link,
					typeof className === "function" ? className(navLinkState) : className,
				]
					.filter(Boolean)
					.join(" ")
			}
			{...rest}
		/>
	);
});

Link.displayName = "Link";
