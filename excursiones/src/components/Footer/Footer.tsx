import { COMPANY_NAME, START_YEAR } from "../../constants";
import { CopyrightIcon, EnvelopeIcon } from "../../ui/Icons";
import styles from "./Footer.module.css";

const COPYRIGHT_TEXT = "Todos los derechos reservados.";
const CONTACT_EMAIL = "hola@excursionesjuntos.com";

/**
 * Componente del pie de página que muestra la información de copyright y el correo de contacto.
 */
export function Footer(): JSX.Element {
	const currentYear = new Date().getFullYear();
	const yearDisplay: string | number =
		START_YEAR === currentYear ? START_YEAR : `${START_YEAR} - ${currentYear}`;

	return (
		<footer className={styles.footer}>
			<a href={`mailto:${CONTACT_EMAIL}`} className={styles.contactLink}>
				<EnvelopeIcon aria-hidden="true" /> {CONTACT_EMAIL}
			</a>
			<small className={styles.footerText}>
				<span>
					<CopyrightIcon className={styles.copyrightIcon} aria-hidden="true" />{" "}
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
