import React, { type CSSProperties } from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";
import { Nav } from "react-bootstrap";
import styles from "./StyledNavLink.module.css";

/**
 * Props para el componente StyledNavLink.
 * Extiende las propiedades de NavLink de react-router-dom para una integración completa.
 */
interface StyledNavLinkProps
	extends Omit<NavLinkProps, "className" | "children" | "style"> {
	/** El contenido del enlace. */
	children: React.ReactNode;
	/** Clases CSS adicionales para el enlace. */
	className?: string;
	/** Estilos en línea para el enlace. */
	style?: CSSProperties;
	/** Variante visual del enlace. */
	variant?: "button" | "link";
}

/**
 * Componente de enlace de navegación con estilos consistentes.
 */
const StyledNavLink = ({
	children,
	className = "",
	variant = "link",
	...rest
}: StyledNavLinkProps) => {
	const variantClass =
		variant === "button" ? styles.buttonLink : styles.textLink;
	const linkClasses =
		`${styles.styledNavLink} ${variantClass} ${className}`.trim();

	return (
		<Nav.Link as={NavLink} className={linkClasses} {...rest}>
			{children}
		</Nav.Link>
	);
};

export default StyledNavLink;
