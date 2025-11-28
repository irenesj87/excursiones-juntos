import React from "react";
import { Link } from "react-router-dom";
import { COMPANY_NAME, ROUTES } from "../../constants";
import { PiMountainsFill } from "react-icons/pi";
import styles from "./Logo.module.css";

/**
 * Componente que renderiza el logo de la aplicación con el texto "Excursiones Juntos".
 */
const Logo = (): JSX.Element => {
	// Asignamos el icono a una constante con el tipo React.ElementType
	// para asegurar a TypeScript que es un componente JSX válido.
	const IconoMontanhas = PiMountainsFill as React.ComponentType<{
		className: string;
	}>;

	return (
		<Link to={ROUTES.HOME} className={styles.logoContainer}>
			<IconoMontanhas className={styles.logoIcon} />
			<span className={styles.logoText}>{COMPANY_NAME}</span>
		</Link>
	);
};

export default Logo;
