import React from "react";
import { MdMail } from "react-icons/md";
import { CONTACT_EMAIL, COMPANY_NAME, START_YEAR } from "../../constants";
import { validateMail } from "../../validation/validations";
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

// Componente Footer que muestra el correo de contacto y el texto de copyright
const Footer = () => {
	const showMailLink = validateMail(CONTACT_EMAIL);

	return (
		<footer className={styles.footer}>
			{showMailLink && (
				<a
					href={`mailto:${CONTACT_EMAIL}`}
					className={styles.mailIconLink}
					aria-label="Enviar correo electrónico"
				>
					<MdMail />
				</a>
			)}

			<small className={styles.footerText}>{getCopyrightText()}</small>
		</footer>
	);
}

export default Footer;
