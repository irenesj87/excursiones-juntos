import { forwardRef } from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";
import cn from "classnames";
import styles from "./Link.module.css";

/**
 * Componente de enlace de navegación (Link) basado en NavLink de react-router-dom.
 * Proporciona estilos consistentes, soporte para estados activos y gestión de accesibilidad mejorada.
 *
 * @param props - Todas las propiedades estándar de NavLink.
 * @param ref - Referencia al elemento HTMLAnchorElement para permitir la integración con otras librerías.
 * @returns Un componente de navegación semántico y estilizado.
 */
export const Link = forwardRef<HTMLAnchorElement, NavLinkProps>(function Link(
	{ className, ...rest },
	ref,
) {
	return (
		<NavLink
			ref={ref}
			className={(navLinkState) =>
				cn(
					"nav-link", // Clase base de Bootstrap para consistencia
					styles.link,
					typeof className === "function" ? className(navLinkState) : className,
				)
			}
			{...rest}
		/>
	);
});

Link.displayName = "Link";
