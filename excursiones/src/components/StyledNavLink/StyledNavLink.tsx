import React from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";
import styles from "./StyledNavLink.module.css";

/**
 * Props para el componente StyledNavLink.
 * Extiende las propiedades de NavLink de react-router-dom para una integración completa.
 */
interface StyledNavLinkProps extends NavLinkProps {
	/** Variante visual del enlace. */
	variant?: "button" | "link";
}

/**
 * Componente de enlace de navegación con estilos consistentes.
 * Envuelve directamente a NavLink de react-router-dom para mantener toda su funcionalidad,
 * como el uso de funciones para `className` y `style` para estados activos.
 */
const StyledNavLink = ({
	className,
	variant = "link",
	...rest
}: StyledNavLinkProps) => {
	const variantClass =
		variant === "button" ? styles.buttonLink : styles.textLink;

	return (
		<NavLink
			className={(navLinkState) =>
				[
					"nav-link", // Clase base de Bootstrap para consistencia
					styles.styledNavLink,
					variantClass,
					typeof className === "function"
						? className(navLinkState)
						: className,
				]
					.filter(Boolean)
					.join(" ")
			}
			{...rest}
		/>
	);
};

export default StyledNavLink;
