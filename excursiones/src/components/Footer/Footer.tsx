import { COMPANY_NAME, START_YEAR } from "../../constants";
import { CopyrightIcon } from "../../ui/Icons";
import styles from "./Footer.module.css";

const COPYRIGHT_TEXT = "Todos los derechos reservados.";

/**
 * Componente del pie de página que muestra la información de copyright y el año.
 */
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
			<p className={styles.disclaimer}>
				Proyecto de desarrollo web para portfolio. Sin fines comerciales.
			</p>
		</footer>
	);
}

export default Footer;
