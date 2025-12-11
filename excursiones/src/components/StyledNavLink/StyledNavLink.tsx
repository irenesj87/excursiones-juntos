import React from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";
import styles from "./StyledNavLink.module.css";

/**
 * Props para el componente StyledNavLink.
 * Extiende las propiedades de NavLink de react-router-dom para una integración completa.
 */
interface StyledNavLinkProps extends NavLinkProps {
	/** Variante visual del enlace. Si se elige la variante button hay un color de fondo, si por el contrario se elige link
	 * no hay color de fondo.
	 */
	readonly variant?: "button" | "link";
}

/**
 * Componente de enlace de navegación con estilos consistentes.
 * Envuelve directamente a NavLink de react-router-dom para mantener toda su funcionalidad,
 * como el uso de funciones para `className` y `style` para estados activos.
 */
function StyledNavLink({
	className,
	variant = "link",
	...rest
}: StyledNavLinkProps): JSX.Element {
	const variantClass =
		variant === "button" ? styles.buttonLink : styles.textLink;

	return (
		<NavLink
			className={(navLinkState) =>
				[
					"nav-link", // Clase base de Bootstrap para consistencia
					styles.styledNavLink,
					variantClass,
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
