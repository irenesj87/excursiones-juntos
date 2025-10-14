import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import styles from "./StyledNavLink.module.css";

/**
 * @typedef {object} StyledNavLinkProps
 * @property {string} to - La ruta de destino del enlace.
 * @property {React.ReactNode} children - El contenido del enlace.
 * @property {() => void} [onClick] - Callback opcional para el evento click.
 * @property {string} [className] - Clases CSS adicionales.
 * @property {'button' | 'link'} [variant='link'] - Variante visual del enlace.
 */

/**
 * Componente de enlace de navegación con estilos consistentes.
 * @param {StyledNavLinkProps} props - Las propiedades del componente.
 * @returns {React.ReactElement} - El componente de enlace de navegación estilizado.
 */
function StyledNavLinkComponent({
	children,
	className = "",
	variant = "link",
	...rest
}) {
	// Desestructuración de props con valores por defecto
	// Combina las clases: la base, la variante y cualquier clase extra.
	const variantClass =
		variant === "button" ? styles.buttonLink : styles.textLink;
	const linkClasses = `${styles.styledNavLink} ${variantClass} ${className}`;

	return (
		<Nav.Link as={NavLink} className={linkClasses} {...rest}>
			{children}
		</Nav.Link>
	);
}

const StyledNavLink = memo(StyledNavLinkComponent);

export default StyledNavLink;
