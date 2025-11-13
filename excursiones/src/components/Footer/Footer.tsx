import React from "react";
import { COMPANY_NAME, START_YEAR } from "../../constants";
import styles from "./Footer.module.css";

/**
 * Genera el texto de copyright dinámicamente según el año actual.
 */
const getCopyrightText = () => {
	const CURRENT_YEAR = new Date().getFullYear();
	const yearDisplay =
		START_YEAR === CURRENT_YEAR
			? START_YEAR
			: `${START_YEAR} - ${CURRENT_YEAR}`;
	return `© ${COMPANY_NAME} ${yearDisplay}. Todos los derechos reservados.`;
};

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<small className={styles.footerText}>{getCopyrightText()}</small>
		</footer>
	);
};

export default Footer;
