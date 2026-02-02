import React from "react";
import { Link } from "react-router-dom";
import { COMPANY_NAME, ROUTES } from "../../constants";
import { LogoIcon } from "../../ui/Icons";
import styles from "./Logo.module.css";

/**
 * Componente que renderiza el logo de la aplicación con el texto "Excursiones Juntos".
 */
function Logo(): JSX.Element {
	return (
		<Link
			to={ROUTES.HOME}
			className={styles.logoContainer}
			aria-label={`Ir al inicio de ${COMPANY_NAME}`}
		>
			<LogoIcon className={styles.logoIcon} aria-hidden="true" />
			<span className={styles.logoText}>{COMPANY_NAME}</span>
		</Link>
	);
}

export default Logo;
