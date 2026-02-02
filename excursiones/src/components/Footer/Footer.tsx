import React from "react";
import { COMPANY_NAME, START_YEAR } from "../../constants";
import { CopyrightIcon } from "../../ui/Icons";
import styles from "./Footer.module.css";

const COPYRIGHT_TEXT = "Todos los derechos reservados.";

function Footer(): JSX.Element {
	const currentYear = new Date().getFullYear();
	const yearDisplay =
		START_YEAR === currentYear ? START_YEAR : `${START_YEAR} - ${currentYear}`;

	return (
		<footer className={styles.footer}>
			<small className={styles.footerText}>
				<CopyrightIcon className={styles.copyrightIcon} aria-hidden="true" />
				<span>
					<span className={styles.companyName}>{COMPANY_NAME}</span>{" "}
					{yearDisplay}. {COPYRIGHT_TEXT}
				</span>
			</small>
		</footer>
	);
}

export default Footer;
