import React from "react";
import { COMPANY_NAME, START_YEAR } from "../../constants";
import { CopyrightIcon } from "../shared/Icons";
import styles from "./Footer.module.css";

function Footer() {
	const currentYear = new Date().getFullYear();
	const yearDisplay =
		START_YEAR === currentYear ? START_YEAR : `${START_YEAR} - ${currentYear}`;

	return (
		<footer className={styles.footer}>
			<small className={styles.footerText}>
				<CopyrightIcon className={styles.copyrightIcon } /> {COMPANY_NAME} {yearDisplay}. Todos los derechos
				reservados.
			</small>
		</footer>
	);
}

export default Footer;
